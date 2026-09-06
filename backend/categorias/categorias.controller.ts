import { Body, Controller, Get, Param, Post, Put, UseGuards } from '@nestjs/common';

import { AuthGuard } from '../common/guards/auth.guard';
import { AdminGuard } from '../common/guards/admin.guard';
import { UsuarioAtual } from '../common/decorators/usuario-atual.decorator';
import { JwtPayload } from '../auth/interfaces/jwt-payload.interface';
import { CategoriasService } from './categorias.service';
import { CriarCategoriaDto } from './dto/criar-categoria.dto';
import { AlterarStatusCategoriaDto } from './dto/alterar-status-categoria.dto';

@Controller('api/categorias')
export class CategoriasController {
  constructor(private readonly categoriasService: CategoriasService) {}

  
  @Get()
  listarAtivas() {
    return this.categoriasService.listarAtivas();
  }

  
  @Get('todas')
  @UseGuards(AuthGuard, AdminGuard)
  listarTodas() {
    return this.categoriasService.listarTodas();
  }

  
  @Post()
  @UseGuards(AuthGuard, AdminGuard)
  criar(@UsuarioAtual() admin: JwtPayload, @Body() dto: CriarCategoriaDto) {
    return this.categoriasService.criar(admin.id, dto);
  }

  
  @Put(':id/status')
  @UseGuards(AuthGuard, AdminGuard)
  alterarStatus(
    @UsuarioAtual() admin: JwtPayload,
    @Param('id') id: string,
    @Body() dto: AlterarStatusCategoriaDto,
  ) {
    return this.categoriasService.alterarStatus(admin.id, Number(id), dto.ativa);
  }
}
