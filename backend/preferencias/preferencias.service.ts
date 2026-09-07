import { Inject, Injectable, InternalServerErrorException } from '@nestjs/common';
import type { DatabaseSync } from 'node:sqlite';

import { DATABASE_CONNECTION } from '../database/database.constants';

@Injectable()
export class PreferenciasService {
  constructor(@Inject(DATABASE_CONNECTION) private readonly db: DatabaseSync) {}

  
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

  
  
  
  atualizar(usuarioId: number, categorias: number[]) {
    
    const idsValidos = categorias.filter((id) => {
      const existe = this.db.prepare('SELECT id FROM categorias WHERE id = ?').get(id);
      return !!existe;
    });

    this.db.exec('BEGIN');
    try {
      
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
