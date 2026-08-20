import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';

import { LembretesService } from './lembretes.service';
import { EventosModule } from '../eventos/eventos.module';

@Module({
  imports: [ScheduleModule.forRoot(), EventosModule],
  providers: [LembretesService],
})
export class LembretesModule {}
