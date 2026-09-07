import { Module } from '@nestjs/common';

import { EventosController } from './eventos.controller';
import { EventosService } from './eventos.service';
import { EventosFotosService } from './eventos-fotos.service';

@Module({
  controllers: [EventosController],
  providers: [EventosService, EventosFotosService],
  exports: [EventosService],
})
export class EventosModule {}
