import { Controller, Delete, Get, HttpCode, Param, Post, Query, UseGuards } from '@nestjs/common';

import { AuthGuard } from '../common/guards/auth.guard';
import { UsuarioAtual } from '../common/decorators/usuario-atual.decorator';
import { JwtPayload } from '../auth/interfaces/jwt-payload.interface';
import { PaginacaoQueryDto } from '../common/dto/paginacao.dto';
import { FavoritosService } from './favoritos.service';

@Controller('api/favoritos')
@UseGuards(AuthGuard)
export class FavoritosController {
  constructor(private readonly favoritosService: FavoritosService) {}

  @Get()
  listar(@UsuarioAtual() usuario: JwtPayload, @Query() { pagina, limite }: PaginacaoQueryDto) {
    return this.favoritosService.listar(usuario.id, pagina, limite);
  }

  @Post(':evento_id')
  @HttpCode(201)
  favoritar(@UsuarioAtual() usuario: JwtPayload, @Param('evento_id') eventoId: string) {
    return this.favoritosService.favoritar(usuario.id, eventoId);
  }

  @Delete(':evento_id')
  remover(@UsuarioAtual() usuario: JwtPayload, @Param('evento_id') eventoId: string) {
    return this.favoritosService.remover(usuario.id, eventoId);
  }
}
