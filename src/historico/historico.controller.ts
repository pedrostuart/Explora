import { Controller, Delete, Get, HttpCode, Param, Post, Query, UseGuards } from '@nestjs/common';

import { AuthGuard } from '../common/guards/auth.guard';
import { UsuarioAtual } from '../common/decorators/usuario-atual.decorator';
import { JwtPayload } from '../auth/interfaces/jwt-payload.interface';
import { PaginacaoQueryDto } from '../common/dto/paginacao.dto';
import { HistoricoService } from './historico.service';

@Controller('api/historico')
@UseGuards(AuthGuard)
export class HistoricoController {
  constructor(private readonly historicoService: HistoricoService) {}

  @Post(':evento_id')
  @HttpCode(201)
  registrarVisualizacao(@UsuarioAtual() usuario: JwtPayload, @Param('evento_id') eventoId: string) {
    return this.historicoService.registrarVisualizacao(usuario.id, eventoId);
  }

  @Get()
  listar(@UsuarioAtual() usuario: JwtPayload, @Query() { pagina, limite }: PaginacaoQueryDto) {
    return this.historicoService.listar(usuario.id, pagina, limite);
  }

  @Delete()
  apagar(@UsuarioAtual() usuario: JwtPayload) {
    return this.historicoService.apagar(usuario.id);
  }
}
