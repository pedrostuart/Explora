import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import type { DatabaseSync } from 'node:sqlite';

import { DATABASE_CONNECTION } from '../database/database.constants';
import { AuditoriaService } from '../auditoria/auditoria.service';
import { paginar } from '../common/utils/paginar';

@Injectable()
export class ComentariosService {
  constructor(
    @Inject(DATABASE_CONNECTION) private readonly db: DatabaseSync,
    private readonly auditoria: AuditoriaService,
  ) {}

  // Ver comentários de um evento (nunca mostra os removidos pela administração) | RN-061 — paginação
  listarPorEvento(eventoId: string, pagina = 1, limite = 20) {
    const comentarios = this.db
      .prepare(
        `SELECT c.id, c.texto, c.criado_em, u.nome AS usuario_nome
         FROM comentarios c JOIN usuarios u ON u.id = c.usuario_id
         WHERE c.evento_id = ? AND c.removido_pela_admin = 0
         ORDER BY c.criado_em DESC`,
      )
      .all(eventoId);

    const { itens, paginacao } = paginar(comentarios, pagina, limite);
    return { comentarios: itens, paginacao };
  }

  // RN076 (não vazio), RN077 (limite de caracteres — validados no DTO),
  // RN078 (data + autor automáticos)
  criar(usuarioId: number, eventoId: string, texto: string) {
    const evento = this.db.prepare('SELECT id FROM eventos WHERE id = ?').get(eventoId);
    if (!evento) {
      throw new NotFoundException({ erro: 'Evento não encontrado.' });
    }

    // RN078 — data (criado_em) e autor (usuario_id) são preenchidos automaticamente pelo schema/insert
    const resultado = this.db
      .prepare('INSERT INTO comentarios (usuario_id, evento_id, texto) VALUES (?, ?, ?)')
      .run(usuarioId, eventoId, texto);

    return { mensagem: 'Comentário publicado.', id: resultado.lastInsertRowid };
  }

  // RN079 — somente administração remove comentário ofensivo
  remover(adminId: number, id: string) {
    const resultado = this.db
      .prepare('UPDATE comentarios SET removido_pela_admin = 1 WHERE id = ?')
      .run(id);

    if (resultado.changes === 0) {
      throw new NotFoundException({ erro: 'Comentário não encontrado.' });
    }

    this.auditoria.registrarLog(adminId, 'comentario_removido', `id ${id}`);
    return { mensagem: 'Comentário removido pela administração.' };
  }
}
