import { BadRequestException, Inject, Injectable, NotFoundException } from '@nestjs/common';
import type { DatabaseSync } from 'node:sqlite';
import * as path from 'node:path';
import * as fs from 'node:fs';
import * as crypto from 'node:crypto';
import Busboy from 'busboy';
import type { Request } from 'express';

import { DATABASE_CONNECTION } from '../database/database.constants';

const LIMITE_FOTOS = 15; // RN-043
const TIPOS_PERMITIDOS = ['image/jpeg', 'image/png', 'image/webp'];
const TAMANHO_MAXIMO = 5 * 1024 * 1024; // 5MB, mesmo limite usado na foto de perfil
const PASTA_UPLOADS = path.join(process.cwd(), 'uploads', 'eventos');

@Injectable()
export class EventosFotosService {
  constructor(@Inject(DATABASE_CONNECTION) private readonly db: DatabaseSync) {
    fs.mkdirSync(PASTA_UPLOADS, { recursive: true });
  }

  listar(eventoId: string) {
    const fotos = this.db
      .prepare('SELECT id, caminho, criado_em FROM evento_fotos WHERE evento_id = ? ORDER BY id')
      .all(eventoId);
    return { fotos, total: fotos.length, limite: LIMITE_FOTOS };
  }

  // RN-026 — upload via streaming com busboy (em vez de multer), processando
  // o arquivo em chunks conforme ele chega, sem carregar tudo na memória de
  // uma vez. RN-043 — limite de 15 fotos por evento.
  async upload(eventoId: string, req: Request): Promise<{ mensagem: string; caminho: string }> {
    const evento = this.db.prepare('SELECT id FROM eventos WHERE id = ?').get(eventoId);
    if (!evento) {
      throw new NotFoundException({ erro: 'Evento não encontrado.' });
    }

    const totalAtual = (
      this.db.prepare('SELECT COUNT(*) AS total FROM evento_fotos WHERE evento_id = ?').get(eventoId) as {
        total: number;
      }
    ).total;

    if (totalAtual >= LIMITE_FOTOS) {
      throw new BadRequestException({ erro: `Este evento já atingiu o limite de ${LIMITE_FOTOS} fotos.` });
    }

    return new Promise((resolve, reject) => {
      const busboy = Busboy({
        headers: req.headers,
        limits: { fileSize: TAMANHO_MAXIMO, files: 1 },
      });

      let arquivoRecebido = false;
      let erroValidacao: Error | null = null;

      busboy.on('file', (_nome, stream, info) => {
        arquivoRecebido = true;

        if (!TIPOS_PERMITIDOS.includes(info.mimeType)) {
          erroValidacao = new BadRequestException({
            erro: 'Formato de imagem não permitido. Use JPG, PNG ou WEBP.',
          });
          stream.resume(); // descarta os bytes (streaming — não guarda em memória)
          return;
        }

        const extensao = path.extname(info.filename).toLowerCase() || '.jpg';
        const nomeArquivo = `evento_${eventoId}_${crypto.randomUUID()}${extensao}`;
        const caminhoCompleto = path.join(PASTA_UPLOADS, nomeArquivo);
        const destino = fs.createWriteStream(caminhoCompleto);

        stream.on('limit', () => {
          erroValidacao = new BadRequestException({ erro: 'Imagem excede o limite de 5MB.' });
        });

        stream.pipe(destino);

        destino.on('close', () => {
          if (erroValidacao) {
            fs.unlink(caminhoCompleto, () => undefined);
            return;
          }
          const caminhoRelativo = `/uploads/eventos/${nomeArquivo}`;
          this.db
            .prepare('INSERT INTO evento_fotos (evento_id, caminho) VALUES (?, ?)')
            .run(eventoId, caminhoRelativo);
          resolve({ mensagem: 'Foto adicionada à galeria do evento.', caminho: caminhoRelativo });
        });
      });

      busboy.on('finish', () => {
        if (erroValidacao) return reject(erroValidacao);
        if (!arquivoRecebido) {
          reject(new BadRequestException({ erro: 'Nenhuma imagem enviada.' }));
        }
      });

      busboy.on('error', (erro) => reject(erro));

      req.pipe(busboy);
    });
  }

  remover(eventoId: string, fotoId: string) {
    const foto = this.db
      .prepare('SELECT caminho FROM evento_fotos WHERE id = ? AND evento_id = ?')
      .get(fotoId, eventoId) as { caminho: string } | undefined;

    if (!foto) {
      throw new NotFoundException({ erro: 'Foto não encontrada.' });
    }

    this.db.prepare('DELETE FROM evento_fotos WHERE id = ?').run(fotoId);

    const caminhoAbsoluto = path.join(process.cwd(), foto.caminho.replace(/^\//, ''));
    fs.unlink(caminhoAbsoluto, () => undefined); // best-effort, não bloqueia a resposta

    return { mensagem: 'Foto removida da galeria.' };
  }
}
