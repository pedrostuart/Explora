import { Controller, Get, Req } from '@nestjs/common';
import { RecomendacoesService } from './recomendacoes.service';

@Controller('api/recomendacoes')
export class RecomendacoesController {
  constructor(private readonly recomendacoesService: RecomendacoesService) {}

  @Get()
  async recomendar(@Req() req: any): Promise<any> {
    return this.recomendacoesService.recomendar(req);
  }
}
