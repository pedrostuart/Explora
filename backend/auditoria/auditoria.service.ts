import { Inject, Injectable } from '@nestjs/common';
import type { DatabaseSync } from 'node:sqlite';

import { DATABASE_CONNECTION } from '../database/database.constants';


@Injectable()
export class AuditoriaService {
  constructor(@Inject(DATABASE_CONNECTION) private readonly db: DatabaseSync) {}

  registrarLog(usuarioId: number | null, acao: string, detalhes = '') {
    this.db
      .prepare('INSERT INTO logs_auditoria (usuario_id, acao, detalhes) VALUES (?, ?, ?)')
      .run(usuarioId, acao, detalhes);
  }
}
