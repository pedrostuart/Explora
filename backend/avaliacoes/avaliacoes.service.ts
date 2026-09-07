import { ConflictException, ForbiddenException, Inject, Injectable, NotFoundException } from '@nestjs/common';
import type { DatabaseSync } from 'node:sqlite';

import { DATABASE_CONNECTION } from '../database/database.constants';
import { paginar } from '../common/utils/paginar';

@Injectable()
export class AvaliacoesService {
  constructor(@Inject(DATABASE_CONNECTION) private readonly db: DatabaseSync) {}

  
  
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

  
  criar(usuarioId: number, eventoId: string, nota: number) {
    
    const inscrito = this.db
      .prepare('SELECT 1 FROM inscricoes WHERE usuario_id = ? AND evento_id = ?')
      .get(usuarioId, eventoId);

    if (!inscrito) {
      throw new ForbiddenException({ erro: 'Somente participantes do evento podem avaliá-lo.' });
    }

    try {
      
      this.db
        .prepare('INSERT INTO avaliacoes (usuario_id, evento_id, nota) VALUES (?, ?, ?)')
        .run(usuarioId, eventoId, nota);
    } catch (erro) {
      throw new ConflictException({ erro: 'Você já avaliou este evento.' }); 
    }

    
    
    return { mensagem: 'Avaliação registrada com sucesso.' };
  }

  
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
