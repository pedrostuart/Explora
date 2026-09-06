import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  Req,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import type { Request } from 'express';
import { EventosService } from './eventos.service';
import { EventosFotosService } from './eventos-fotos.service';
import { CriarEventoDto } from './dto/criar-evento.dto';
import { AtualizarEventoDto } from './dto/atualizar-evento.dto';
import { AuthGuard } from '../common/guards/auth.guard';
import { AdminGuard } from '../common/guards/admin.guard';
import { UsuarioAtual } from '../common/decorators/usuario-atual.decorator';
import { JwtPayload } from '../auth/interfaces/jwt-payload.interface';

@Controller('api/eventos')
export class EventosController {
  constructor(
    private readonly eventosService: EventosService,
    private readonly eventosFotosService: EventosFotosService,
  ) {}

  
  
  
  @Get()
  async listar(@Query() query: any): Promise<any> {
    return this.eventosService.listar(query);
  }

  @Get('destaques')
  async destaquesHoje(): Promise<any> {
    return this.eventosService.destaquesHoje();
  }

  @Get('sugestoes')
  sugestoes(@Query('q') q: string): any {
    return this.eventosService.sugestoes(q);
  }

  
  
  @Get('pendentes')
  @UseGuards(AuthGuard, AdminGuard)
  listarPendentes(@Query('pagina') pagina?: string, @Query('limite') limite?: string): any {
    return this.eventosService.listarPendentes(Number(pagina) || 1, Number(limite) || 20);
  }

  @Get(':id')
  async buscarPorId(@Param('id') id: string): Promise<any> {
    return this.eventosService.buscarPorId(id);
  }

  
  
  
  @Post()
  @UseGuards(AuthGuard)
  @UsePipes(new ValidationPipe({ transform: true }))
  criar(@UsuarioAtual() usuario: JwtPayload, @Body() dto: CriarEventoDto) {
    return this.eventosService.criar(usuario, dto);
  }

  @Put(':id')
  @UseGuards(AuthGuard)
  @UsePipes(new ValidationPipe({ transform: true }))
  atualizar(@UsuarioAtual() usuario: JwtPayload, @Param('id') id: string, @Body() dto: AtualizarEventoDto) {
    return this.eventosService.atualizar(usuario, id, dto);
  }

  @Post(':id/encerrar')
  @UseGuards(AuthGuard)
  encerrar(@UsuarioAtual() usuario: JwtPayload, @Param('id') id: string) {
    return this.eventosService.encerrar(usuario, id);
  }

  
  
  
  @Post(':id/aprovar')
  @UseGuards(AuthGuard, AdminGuard)
  aprovar(@UsuarioAtual() usuario: JwtPayload, @Param('id') id: string) {
    return this.eventosService.aprovar(usuario.id, id);
  }

  @Post(':id/rejeitar')
  @UseGuards(AuthGuard, AdminGuard)
  rejeitar(@UsuarioAtual() usuario: JwtPayload, @Param('id') id: string, @Body('motivo') motivo?: string) {
    return this.eventosService.rejeitar(usuario.id, id, motivo);
  }

  @Post(':id/cancelar')
  @UseGuards(AuthGuard, AdminGuard)
  cancelar(@UsuarioAtual() usuario: JwtPayload, @Param('id') id: string) {
    return this.eventosService.cancelar(usuario.id, id);
  }

  @Put(':id/patrocinio')
  @UseGuards(AuthGuard, AdminGuard)
  patrocinar(@UsuarioAtual() usuario: JwtPayload, @Param('id') id: string, @Body('patrocinado') patrocinado: unknown) {
    return this.eventosService.patrocinar(usuario.id, id, patrocinado);
  }

  
  
  
  @Get(':id/fotos')
  listarFotos(@Param('id') id: string) {
    return this.eventosFotosService.listar(id);
  }

  @Post(':id/fotos')
  @UseGuards(AuthGuard)
  uploadFoto(@Param('id') id: string, @Req() req: Request) {
    return this.eventosFotosService.upload(id, req);
  }

  @Delete(':id/fotos/:fotoId')
  @UseGuards(AuthGuard)
  removerFoto(@Param('id') id: string, @Param('fotoId') fotoId: string) {
    return this.eventosFotosService.remover(id, fotoId);
  }
}
