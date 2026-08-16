import { Controller, Delete, Get, HttpCode, Param, Post, Query, UseGuards } from '@nestjs/common';

import { AuthGuard } from '../common/guards/auth.guard';
import { UsuarioAtual } from '../common/decorators/usuario-atual.decorator';
import { JwtPayload } from '../auth/interfaces/jwt-payload.interface';
import { PaginacaoQueryDto } from '../common/dto/paginacao.dto';
import { InscricoesService } from './inscricoes.service';

@Controller('api/inscricoes')
@UseGuards(AuthGuard)
export class InscricoesController {
  constructor(private readonly inscricoesService: InscricoesService) {}

  @Post(':evento_id')
  @HttpCode(201)
  inscrever(@UsuarioAtual() usuario: JwtPayload, @Param('evento_id') eventoId: string) {
    return this.inscricoesService.inscrever(usuario.id, eventoId);
  }

  @Delete(':evento_id')
  cancelar(@UsuarioAtual() usuario: JwtPayload, @Param('evento_id') eventoId: string) {
    return this.inscricoesService.cancelar(usuario.id, eventoId);
  }

  @Get()
  listar(@UsuarioAtual() usuario: JwtPayload, @Query() { pagina, limite }: PaginacaoQueryDto) {
    return this.inscricoesService.listar(usuario.id, pagina, limite);
  }
}
