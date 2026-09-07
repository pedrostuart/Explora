import { Body, Controller, Delete, Get, HttpCode, Param, Post, Query, UseGuards } from '@nestjs/common';

import { AuthGuard } from '../common/guards/auth.guard';
import { AdminGuard } from '../common/guards/admin.guard';
import { UsuarioAtual } from '../common/decorators/usuario-atual.decorator';
import { JwtPayload } from '../auth/interfaces/jwt-payload.interface';
import { PaginacaoQueryDto } from '../common/dto/paginacao.dto';
import { ComentariosService } from './comentarios.service';
import { CriarComentarioDto } from './dto/criar-comentario.dto';

@Controller('api/comentarios')
export class ComentariosController {
  constructor(private readonly comentariosService: ComentariosService) {}

  @Get('evento/:evento_id')
  listarPorEvento(
    @Param('evento_id') eventoId: string,
    @Query() { pagina, limite }: PaginacaoQueryDto,
  ) {
    return this.comentariosService.listarPorEvento(eventoId, pagina, limite);
  }

  @Post(':evento_id')
  @HttpCode(201)
  @UseGuards(AuthGuard)
  criar(
    @UsuarioAtual() usuario: JwtPayload,
    @Param('evento_id') eventoId: string,
    @Body() dto: CriarComentarioDto,
  ) {
    return this.comentariosService.criar(usuario.id, eventoId, dto.texto);
  }

  @Delete(':id')
  @UseGuards(AuthGuard, AdminGuard)
  remover(@UsuarioAtual() admin: JwtPayload, @Param('id') id: string) {
    return this.comentariosService.remover(admin.id, id);
  }
}
