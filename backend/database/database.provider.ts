import { Logger, Provider } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { DatabaseSync } from 'node:sqlite';
import * as fs from 'node:fs';
import * as path from 'node:path';

import { DATABASE_CONNECTION } from './database.constants';
import { seedDadosDemo } from './database.seed';

const logger = new Logger('DatabaseProvider');

export const databaseProvider: Provider = {
  provide: DATABASE_CONNECTION,
  inject: [ConfigService],
  useFactory: (config: ConfigService): DatabaseSync => {
    const caminhoBanco =
      config.get<string>('DATABASE_PATH') || path.join(__dirname, 'database.sqlite');

    const db = new DatabaseSync(caminhoBanco);

    
    
    
    
    
    
    db.exec('PRAGMA foreign_keys = ON;');

    
    
    const caminhoSchema = path.join(__dirname, '..', '..', 'explora.sql');
    const schema = fs.readFileSync(caminhoSchema, 'utf8');
    db.exec(schema);

    
    
    seedDadosDemo(db);

    logger.log(`Banco de dados conectado em: ${caminhoBanco}`);

    return db;
  },
};
