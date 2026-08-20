import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import type { DatabaseSync } from 'node:sqlite';

import { DATABASE_CONNECTION } from '../database/database.constants';
import { paginar } from '../common/utils/paginar';

@Injectable()
export class HistoricoService {
  constructor(@Inject(DATABASE_CONNECTION) private readonly db: DatabaseSync) {}

  // RN068 — registrar visualização de evento
  registrarVisualizacao(usuarioId: number, eventoId: string) {
    const evento = this.db.prepare('SELECT id FROM eventos WHERE id = ?').get(eventoId);
    if (!evento) {
      throw new NotFoundException({ erro: 'Evento não encontrado.' });
    }

    this.db.prepare('INSERT INTO historico (usuario_id, evento_id) VALUES (?, ?)').run(usuarioId, eventoId);

    return { mensagem: 'Visualização registrada.' };
  }

  // Ver o próprio histórico | RN-061 — paginação
  listar(usuarioId: number, pagina = 1, limite = 20) {
    const historico = this.db
      .prepare(
        `SELECT e.*, h.data_visualizacao
         FROM historico h
         JOIN eventos e ON e.id = h.evento_id
         WHERE h.usuario_id = ?
         ORDER BY h.data_visualizacao DESC`,
      )
      .all(usuarioId);

    const { itens, paginacao } = paginar(historico, pagina, limite);
    return { historico: itens, paginacao };
  }

  // RN069 — usuário pode apagar o próprio histórico
  apagar(usuarioId: number) {
    this.db.prepare('DELETE FROM historico WHERE usuario_id = ?').run(usuarioId);
    return { mensagem: 'Histórico apagado com sucesso.' };
  }
}
