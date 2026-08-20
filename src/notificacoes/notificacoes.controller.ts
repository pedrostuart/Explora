import { Controller, Get, Param, Put, Query, UseGuards } from '@nestjs/common';

import { AuthGuard } from '../common/guards/auth.guard';
import { UsuarioAtual } from '../common/decorators/usuario-atual.decorator';
import { JwtPayload } from '../auth/interfaces/jwt-payload.interface';
import { PaginacaoQueryDto } from '../common/dto/paginacao.dto';
import { NotificacoesService } from './notificacoes.service';

@Controller('api/notificacoes')
@UseGuards(AuthGuard)
export class NotificacoesController {
  constructor(private readonly notificacoesService: NotificacoesService) {}

  @Get()
  listar(
    @UsuarioAtual() usuario: JwtPayload,
    @Query('lida') lida: string | undefined,
    @Query() { pagina, limite }: PaginacaoQueryDto,
  ) {
    return this.notificacoesService.listar(usuario.id, lida, pagina, limite);
  }

  @Put(':id/lido')
  marcarComoLida(@UsuarioAtual() usuario: JwtPayload, @Param('id') id: string) {
    return this.notificacoesService.marcarComoLida(usuario.id, id);
  }
}
