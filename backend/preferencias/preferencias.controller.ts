import { Body, Controller, Get, Put, UseGuards } from '@nestjs/common';

import { AuthGuard } from '../common/guards/auth.guard';
import { UsuarioAtual } from '../common/decorators/usuario-atual.decorator';
import { JwtPayload } from '../auth/interfaces/jwt-payload.interface';
import { PreferenciasService } from './preferencias.service';
import { AtualizarPreferenciasDto } from './dto/atualizar-preferencias.dto';

@Controller('api/preferencias')
@UseGuards(AuthGuard)
export class PreferenciasController {
  constructor(private readonly preferenciasService: PreferenciasService) {}

  @Get()
  listar(@UsuarioAtual() usuario: JwtPayload) {
    return this.preferenciasService.listar(usuario.id);
  }

  @Put()
  atualizar(@UsuarioAtual() usuario: JwtPayload, @Body() dto: AtualizarPreferenciasDto) {
    return this.preferenciasService.atualizar(usuario.id, dto.categorias);
  }
}
