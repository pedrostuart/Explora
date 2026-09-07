import { Body, Controller, Delete, Get, HttpCode, Param, Post, Query, UseGuards } from '@nestjs/common';

import { AuthGuard } from '../common/guards/auth.guard';
import { UsuarioAtual } from '../common/decorators/usuario-atual.decorator';
import { JwtPayload } from '../auth/interfaces/jwt-payload.interface';
import { PaginacaoQueryDto } from '../common/dto/paginacao.dto';
import { AvaliacoesService } from './avaliacoes.service';
import { CriarAvaliacaoDto } from './dto/criar-avaliacao.dto';

@Controller('api/avaliacoes')
export class AvaliacoesController {
  constructor(private readonly avaliacoesService: AvaliacoesService) {}

  @Get('evento/:evento_id')
  listarPorEvento(
    @Param('evento_id') eventoId: string,
    @Query() { pagina, limite }: PaginacaoQueryDto,
  ) {
    return this.avaliacoesService.listarPorEvento(eventoId, pagina, limite);
  }

  @Post(':evento_id')
  @HttpCode(201)
  @UseGuards(AuthGuard)
  criar(
    @UsuarioAtual() usuario: JwtPayload,
    @Param('evento_id') eventoId: string,
    @Body() dto: CriarAvaliacaoDto,
  ) {
    return this.avaliacoesService.criar(usuario.id, eventoId, dto.nota);
  }

  @Delete(':evento_id')
  @UseGuards(AuthGuard)
  remover(@UsuarioAtual() usuario: JwtPayload, @Param('evento_id') eventoId: string) {
    return this.avaliacoesService.remover(usuario.id, eventoId);
  }
}
