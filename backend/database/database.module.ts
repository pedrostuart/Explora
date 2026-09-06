import { Global, Module } from '@nestjs/common';

import { databaseProvider } from './database.provider';
import { DATABASE_CONNECTION } from './database.constants';


@Global()
@Module({
  providers: [databaseProvider],
  exports: [DATABASE_CONNECTION],
})
export class DatabaseModule {}
