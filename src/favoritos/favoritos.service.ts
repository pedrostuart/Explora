import { BadRequestException, ConflictException, Inject, Injectable, NotFoundException } from '@nestjs/common';
import type { DatabaseSync } from 'node:sqlite';

import { DATABASE_CONNECTION } from '../database/database.constants';
import { paginar } from '../common/utils/paginar';

@Injectable()
export class FavoritosService {
  constructor(@Inject(DATABASE_CONNECTION) private readonly db: DatabaseSync) {}

  // RN059 (usado na recomendação) — listar meus favoritos | RN-061 — paginação
  listar(usuarioId: number, pagina = 1, limite = 20) {
    const favoritos = this.db
      .prepare(
        `SELECT e.*, f.data_favoritado
         FROM favoritos f
         JOIN eventos e ON e.id = f.evento_id
         WHERE f.usuario_id = ?
         ORDER BY f.data_favoritado DESC`,
      )
      .all(usuarioId);

    const { itens, paginacao } = paginar(favoritos, pagina, limite);
    return { favoritos: itens, paginacao };
  }

  // RN055 — só favorita evento ativo | RN056 — não duplica | RN058 — registra data
  favoritar(usuarioId: number, eventoId: string) {
    const evento = this.db.prepare('SELECT status FROM eventos WHERE id = ?').get(eventoId) as
      | { status: string }
      | undefined;

    if (!evento) {
      throw new NotFoundException({ erro: 'Evento não encontrado.' });
    }
    if (evento.status === 'cancelado' || evento.status === 'encerrado' || evento.status === 'pendente') {
      throw new BadRequestException({ erro: 'Este evento não está disponível para ser favoritado.' });
    }

    try {
      // A PRIMARY KEY (usuario_id, evento_id) do schema garante RN056 sem duplicar
      this.db.prepare('INSERT INTO favoritos (usuario_id, evento_id) VALUES (?, ?)').run(usuarioId, eventoId);
    } catch (erro) {
      throw new ConflictException({ erro: 'Você já favoritou este evento.' }); // RN056
    }

    return { mensagem: 'Evento favoritado com sucesso.' };
  }

  // RN057 — remover favorito
  remover(usuarioId: number, eventoId: string) {
    const resultado = this.db
      .prepare('DELETE FROM favoritos WHERE usuario_id = ? AND evento_id = ?')
      .run(usuarioId, eventoId);

    if (resultado.changes === 0) {
      throw new NotFoundException({ erro: 'Favorito não encontrado.' });
    }

    return { mensagem: 'Favorito removido.' };
  }
}
