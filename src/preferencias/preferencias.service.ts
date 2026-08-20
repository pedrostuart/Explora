import { Inject, Injectable, InternalServerErrorException } from '@nestjs/common';
import type { DatabaseSync } from 'node:sqlite';

import { DATABASE_CONNECTION } from '../database/database.constants';

@Injectable()
export class PreferenciasService {
  constructor(@Inject(DATABASE_CONNECTION) private readonly db: DatabaseSync) {}

  // RN026, RN027 — ver/alterar preferências a qualquer momento
  listar(usuarioId: number) {
    const preferencias = this.db
      .prepare(
        `SELECT c.id, c.nome FROM preferencias p
         JOIN categorias c ON c.id = p.categoria_id
         WHERE p.usuario_id = ?`,
      )
      .all(usuarioId);

    return { preferencias };
  }

  // RN026 (múltiplas categorias), RN027 (alterar a qualquer momento),
  // RN029 (sem duplicar — já garantido pelo DTO com @ArrayUnique),
  // RN091 (vínculo com categoria existente)
  atualizar(usuarioId: number, categorias: number[]) {
    // RN091 — só aceita categorias que existem de fato
    const idsValidos = categorias.filter((id) => {
      const existe = this.db.prepare('SELECT id FROM categorias WHERE id = ?').get(id);
      return !!existe;
    });

    this.db.exec('BEGIN');
    try {
      // Substitui completamente a lista anterior — evita duplicados (RN029) por construção
      this.db.prepare('DELETE FROM preferencias WHERE usuario_id = ?').run(usuarioId);

      const inserir = this.db.prepare('INSERT INTO preferencias (usuario_id, categoria_id) VALUES (?, ?)');
      for (const categoriaId of idsValidos) {
        inserir.run(usuarioId, categoriaId);
      }

      this.db.exec('COMMIT');
    } catch (erro) {
      this.db.exec('ROLLBACK');
      throw new InternalServerErrorException({ erro: 'Não foi possível salvar as preferências.' });
    }

    return { mensagem: 'Preferências atualizadas com sucesso.', categorias: idsValidos };
  }
}
