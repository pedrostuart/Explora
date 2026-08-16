import { Logger, Provider } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
// Usa o módulo nativo do Node (não precisa instalar nada, não compila nada)
import { DatabaseSync } from 'node:sqlite';
import * as fs from 'node:fs';
import * as path from 'node:path';

import { DATABASE_CONNECTION } from './database.constants';

const logger = new Logger('DatabaseProvider');

export const databaseProvider: Provider = {
  provide: DATABASE_CONNECTION,
  inject: [ConfigService],
  useFactory: (config: ConfigService): DatabaseSync => {
    const caminhoBanco =
      config.get<string>('DATABASE_PATH') || path.join(__dirname, 'database.sqlite');

    const db = new DatabaseSync(caminhoBanco);

    // RN-070 — o node:sqlite já vem com PRAGMA foreign_keys=ON por padrão,
    // mas fixamos isso explicitamente: é a API que garante que os
    // ON DELETE CASCADE do schema.sql realmente rodem (sem isso, o SQLite
    // tradicionalmente ignora silenciosamente as regras de FK). Como
    // node:sqlite ainda é uma API experimental "que pode mudar a qualquer
    // momento", não confiamos apenas no padrão implícito.
    db.exec('PRAGMA foreign_keys = ON;');

    // Roda o schema.sql sempre que o servidor inicia
    // (usar CREATE TABLE IF NOT EXISTS faz isso ser seguro de repetir)
    const caminhoSchema = path.join(__dirname, 'schema.sql');
    const schema = fs.readFileSync(caminhoSchema, 'utf8');
    db.exec(schema);

    logger.log(`Banco de dados conectado em: ${caminhoBanco}`);

    return db;
  },
};
