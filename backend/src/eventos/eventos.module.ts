import { Module } from '@nestjs/common';
import { EventosController } from './eventos.controller';
import { EventosService } from './eventos.service';
import { DatabaseModule } from '../database/database.module';

@Module({
  controllers: [EventosController],
  providers: [EventosService],
  imports: [DatabaseModule]
})
export class EventosModule {}
