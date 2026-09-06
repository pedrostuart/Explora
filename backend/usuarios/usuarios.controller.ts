import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Res,
  UploadedFile,
  UseGuards,
  UseInterceptors,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import type { Response } from 'express';
import * as path from 'node:path';
import * as fs from 'node:fs';

import { AuthGuard } from '../common/guards/auth.guard';
import { AdminGuard } from '../common/guards/admin.guard';
import { UsuarioAtual } from '../common/decorators/usuario-atual.decorator';
import { JwtPayload } from '../auth/interfaces/jwt-payload.interface';
import { UsuariosService } from './usuarios.service';
import { AtualizarPerfilDto } from './dto/atualizar-perfil.dto';
import { AlterarAtivoDto } from './dto/alterar-ativo.dto';
import { AlterarPapelDto } from './dto/alterar-papel.dto';
import { SenhaAtualDto } from './dto/senha-atual.dto';
import { TrocarSenhaDto } from './dto/trocar-senha.dto';


const PASTA_UPLOADS = path.join(process.cwd(), 'uploads', 'fotos');
fs.mkdirSync(PASTA_UPLOADS, { recursive: true });

@Controller('api/usuarios')
export class UsuariosController {
  constructor(private readonly usuariosService: UsuariosService) {}

  
  
  
  @Get('me')
  @UseGuards(AuthGuard)
  meuPerfil(@UsuarioAtual() usuario: JwtPayload) {
    return this.usuariosService.meuPerfil(usuario.id);
  }

  
  
  
  @Put('me')
  @UseGuards(AuthGuard)
  atualizarPerfil(@UsuarioAtual() usuario: JwtPayload, @Body() dto: AtualizarPerfilDto) {
    return this.usuariosService.atualizarPerfil(usuario.id, dto);
  }

  
  
  
  @Post('me/foto')
  @UseGuards(AuthGuard)
  @UseInterceptors(
    FileInterceptor('foto', {
      storage: diskStorage({
        destination: PASTA_UPLOADS,
        filename: (req: any, file, cb) => {
          const extensao = path.extname(file.originalname).toLowerCase();
          cb(null, `usuario_${req.usuario.id}_${Date.now()}${extensao}`);
        },
      }),
      limits: { fileSize: 5 * 1024 * 1024 }, 
      fileFilter: (req, file, cb) => {
        const tiposPermitidos = ['image/jpeg', 'image/png', 'image/webp']; 
        if (tiposPermitidos.includes(file.mimetype)) {
          cb(null, true);
        } else {
          cb(
            new BadRequestException({ erro: 'Formato de imagem não permitido. Use JPG, PNG ou WEBP.' }),
            false,
          );
        }
      },
    }),
  )
  atualizarFoto(@UsuarioAtual() usuario: JwtPayload, @UploadedFile() arquivo: any) {
    return this.usuariosService.atualizarFoto(usuario.id, arquivo);
  }

  
  
  
  @Put('me/senha')
  @UseGuards(AuthGuard)
  @UsePipes(new ValidationPipe({ transform: true }))
  trocarSenha(@UsuarioAtual() usuario: JwtPayload, @Body() dto: TrocarSenhaDto) {
    return this.usuariosService.trocarSenha(usuario.id, dto.senha_atual, dto.nova_senha);
  }

  
  
  
  @Put('me/desativar')
  @UseGuards(AuthGuard)
  desativarConta(
    @UsuarioAtual() usuario: JwtPayload,
    @Body() dto: SenhaAtualDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    return this.usuariosService.desativarConta(usuario.id, dto.senha_atual, res, usuario.jti);
  }

  
  @Put(':id/ativo')
  @UseGuards(AuthGuard, AdminGuard)
  alterarAtivo(
    @UsuarioAtual() admin: JwtPayload,
    @Param('id') id: string,
    @Body() dto: AlterarAtivoDto,
  ) {
    return this.usuariosService.alterarAtivo(admin.id, Number(id), dto.ativa);
  }

  
  @Put(':id/papel')
  @UseGuards(AuthGuard, AdminGuard)
  alterarPapel(
    @UsuarioAtual() admin: JwtPayload,
    @Param('id') id: string,
    @Body() dto: AlterarPapelDto,
  ) {
    return this.usuariosService.alterarPapel(admin.id, Number(id), dto.role);
  }

  
  
  
  @Delete('me')
  @UseGuards(AuthGuard)
  excluirConta(
    @UsuarioAtual() usuario: JwtPayload,
    @Body() dto: SenhaAtualDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    return this.usuariosService.excluirConta(usuario.id, dto.senha_atual, res, usuario.jti);
  }
}
