import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import type { DatabaseSync } from 'node:sqlite';

import { DATABASE_CONNECTION } from '../database/database.constants';
import { paginar } from '../common/utils/paginar';

@Injectable()
export class NotificacoesService {
  constructor(@Inject(DATABASE_CONNECTION) private readonly db: DatabaseSync) {}

  
  listar(usuarioId: number, lida?: string, pagina = 1, limite = 20) {
    let sql = `SELECT id, tipo, mensagem, lida, criado_em FROM notificacoes WHERE usuario_id = ?`;
    const params: unknown[] = [usuarioId];

    if (lida !== undefined) {
      const filtroLida = lida === '1' || lida === 'true' ? 1 : 0;
      sql += ' AND lida = ?';
      params.push(filtroLida);
    }

    sql += ' ORDER BY criado_em DESC';

    const notificacoes = this.db.prepare(sql).all(...(params as any[]));
    const { itens, paginacao } = paginar(notificacoes, pagina, limite);
    return { notificacoes: itens, paginacao };
  }

  
  marcarComoLida(usuarioId: number, id: string) {
    const resultado = this.db
      .prepare('UPDATE notificacoes SET lida = 1 WHERE id = ? AND usuario_id = ?')
      .run(id, usuarioId);

    if (resultado.changes === 0) {
      throw new NotFoundException({ erro: 'Notificação não encontrada.' });
    }

    return { mensagem: 'Notificação marcada como lida.' };
  }
}
