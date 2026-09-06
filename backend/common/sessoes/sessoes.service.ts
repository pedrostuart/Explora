import { Inject, Injectable } from '@nestjs/common';
import type { DatabaseSync } from 'node:sqlite';

import { DATABASE_CONNECTION } from '../../database/database.constants';






@Injectable()
export class SessoesService {
  constructor(@Inject(DATABASE_CONNECTION) private readonly db: DatabaseSync) {}

  invalidar(jti: string, expiraEm: Date) {
    this.db
      .prepare('INSERT OR REPLACE INTO sessoes_invalidadas (jti, expira_em) VALUES (?, ?)')
      .run(jti, expiraEm.toISOString());
  }

  estaInvalidado(jti: string): boolean {
    const registro = this.db
      .prepare('SELECT 1 FROM sessoes_invalidadas WHERE jti = ?')
      .get(jti);
    return !!registro;
  }

  
  limparExpiradas() {
    this.db.prepare("DELETE FROM sessoes_invalidadas WHERE expira_em < datetime('now')").run();
  }
}
