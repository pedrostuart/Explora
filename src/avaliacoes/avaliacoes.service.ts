import { ConflictException, ForbiddenException, Inject, Injectable, NotFoundException } from '@nestjs/common';
import type { DatabaseSync } from 'node:sqlite';

import { DATABASE_CONNECTION } from '../database/database.constants';
import { paginar } from '../common/utils/paginar';

@Injectable()
export class AvaliacoesService {
  constructor(@Inject(DATABASE_CONNECTION) private readonly db: DatabaseSync) {}

  // Ver avaliações de um evento + média (RN074 — sempre calculada ao vivo, nunca fica "velha")
  // RN-061 — paginação (a média/total consideram TODAS as avaliações, não só a página atual)
  listarPorEvento(eventoId: string, pagina = 1, limite = 20) {
    const avaliacoes = this.db
      .prepare(
        `SELECT a.id, a.nota, a.criado_em, u.nome AS usuario_nome
         FROM avaliacoes a JOIN usuarios u ON u.id = a.usuario_id
         WHERE a.evento_id = ?
         ORDER BY a.criado_em DESC`,
      )
      .all(eventoId);

    const media = this.db
      .prepare('SELECT ROUND(AVG(nota), 2) AS media, COUNT(*) AS total FROM avaliacoes WHERE evento_id = ?')
      .get(eventoId) as { media: number | null; total: number };

    const { itens, paginacao } = paginar(avaliacoes, pagina, limite);
    return { avaliacoes: itens, media: media.media, total: media.total, paginacao };
  }

  // RN071 (só participantes), RN072 (uma vez só), RN073 (nota 1-5)
  criar(usuarioId: number, eventoId: string, nota: number) {
    // RN071 — somente quem se inscreveu no evento pode avaliar
    const inscrito = this.db
      .prepare('SELECT 1 FROM inscricoes WHERE usuario_id = ? AND evento_id = ?')
      .get(usuarioId, eventoId);

    if (!inscrito) {
      throw new ForbiddenException({ erro: 'Somente participantes do evento podem avaliá-lo.' });
    }

    try {
      // UNIQUE(usuario_id, evento_id) do schema garante RN072 sem precisar checar manualmente
      this.db
        .prepare('INSERT INTO avaliacoes (usuario_id, evento_id, nota) VALUES (?, ?, ?)')
        .run(usuarioId, eventoId, nota);
    } catch (erro) {
      throw new ConflictException({ erro: 'Você já avaliou este evento.' }); // RN072
    }

    // RN074 — não guardamos média em coluna própria; ela é sempre calculada
    // ao vivo via AVG(), então "recalcular" já acontece automaticamente em toda consulta.
    return { mensagem: 'Avaliação registrada com sucesso.' };
  }

  // RN075 — excluir avaliação (a média se ajusta sozinha, pois é calculada ao vivo)
  remover(usuarioId: number, eventoId: string) {
    const resultado = this.db
      .prepare('DELETE FROM avaliacoes WHERE usuario_id = ? AND evento_id = ?')
      .run(usuarioId, eventoId);

    if (resultado.changes === 0) {
      throw new NotFoundException({ erro: 'Avaliação não encontrada.' });
    }

    return { mensagem: 'Avaliação removida. A média foi atualizada automaticamente.' };
  }
}
