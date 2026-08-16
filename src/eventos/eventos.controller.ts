import { Controller, Get, Query } from '@nestjs/common';
import { EventosService } from './eventos.service';

@Controller('api/eventos') // Ajuste o prefixo da rota se o seu projeto usar outro (ex: 'eventos')
export class EventosController {
  constructor(private readonly eventosService: EventosService) {}

  @Get()
  async listar(@Query() query: any): Promise<any> {
    return this.eventosService.listar(query);
  }

  @Get('destaques') // Ajuste o nome da rota se o seu método original usava outro endpoint
  async destaquesHoje(): Promise<any> {
    return this.eventosService.destaquesHoje();
  }
}
