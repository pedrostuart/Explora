import { Inject, Injectable } from '@nestjs/common';
import type { DatabaseSync } from 'node:sqlite';

import { DATABASE_CONNECTION } from '../database/database.constants';

interface EventoRow {
  id: number;
  categoria_id: number;
  endereco: string;
  latitude: number | null;
  longitude: number | null;
  media_avaliacao: number | null;
  patrocinado: number;
  distancia_km?: number;
  [key: string]: unknown;
}


function calcularDistanciaKm(
  lat1: number | null,
  lon1: number | null,
  lat2: number | null,
  lon2: number | null,
): number | null {
  if (lat1 == null || lon1 == null || lat2 == null || lon2 == null) return null;
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((lat1 * Math.PI) / 180) * Math.cos((lat2 * Math.PI) / 180) * Math.sin(dLon / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

function normalizarTexto(texto: string | null | undefined): string {
  return (texto || '').normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();
}

@Injectable()
export class RecomendacoesService {
  constructor(@Inject(DATABASE_CONNECTION) private readonly db: DatabaseSync) {}

  
  recomendar(usuarioId: number, lat?: string, lng?: string) {
    
    let cidadeUsuario: string | null = null;
    if (!lat || !lng) {
      const usuario = this.db.prepare('SELECT cidade FROM usuarios WHERE id = ?').get(usuarioId) as
        | { cidade: string | null }
        | undefined;
      cidadeUsuario = usuario?.cidade ? normalizarTexto(usuario.cidade) : null;
    }

    
    const eventos = this.db
      .prepare(
        `SELECT e.*, c.nome AS categoria_nome,
           (SELECT ROUND(AVG(nota), 1) FROM avaliacoes WHERE evento_id = e.id) AS media_avaliacao
         FROM eventos e
         JOIN categorias c ON c.id = e.categoria_id
         WHERE e.status = 'ativo'`,
      )
      .all() as unknown as EventoRow[];

    
    const preferencias = (
      this.db.prepare('SELECT categoria_id FROM preferencias WHERE usuario_id = ?').all(usuarioId) as {
        categoria_id: number;
      }[]
    ).map((p) => p.categoria_id);

    
    const categoriasHistorico = (
      this.db
        .prepare(
          `SELECT DISTINCT e.categoria_id FROM historico h
           JOIN eventos e ON e.id = h.evento_id
           WHERE h.usuario_id = ?`,
        )
        .all(usuarioId) as { categoria_id: number }[]
    ).map((r) => r.categoria_id);

    
    const categoriasFavoritos = (
      this.db
        .prepare(
          `SELECT DISTINCT e.categoria_id FROM favoritos f
           JOIN eventos e ON e.id = f.evento_id
           WHERE f.usuario_id = ?`,
        )
        .all(usuarioId) as { categoria_id: number }[]
    ).map((r) => r.categoria_id);

    
    
    const semSinalProprio =
      preferencias.length === 0 && categoriasHistorico.length === 0 && categoriasFavoritos.length === 0;

    if (semSinalProprio) {
      const populares = eventos
        .slice()
        .sort((a, b) => (b.media_avaliacao || 0) - (a.media_avaliacao || 0));
      return { recomendacoes: populares, modo: 'populares (sem preferências definidas)' };
    }

    const eventosComScore = eventos.map((evento) => {
      let score = 0;

      if (preferencias.includes(evento.categoria_id)) score += 3; 
      if (categoriasHistorico.includes(evento.categoria_id)) score += 2; 
      if (categoriasFavoritos.includes(evento.categoria_id)) score += 2; 

      if (lat && lng && evento.latitude != null && evento.longitude != null) {
        const distancia = calcularDistanciaKm(Number(lat), Number(lng), evento.latitude, evento.longitude);
        evento.distancia_km = Math.round((distancia ?? 0) * 10) / 10; 
        if ((distancia ?? Infinity) <= 5) score += 3; 
        else if ((distancia ?? Infinity) <= 15) score += 1;
      } else if (cidadeUsuario && normalizarTexto(evento.endereco).includes(cidadeUsuario)) {
        
        score += 2;
      }

      score += (evento.media_avaliacao || 0) * 1; 

      if (evento.patrocinado) score += 4; 

      return { ...evento, score };
    });

    eventosComScore.sort((a, b) => b.score - a.score);

    return { recomendacoes: eventosComScore, modo: 'personalizado' };
  }
}
