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

// Pasta onde as fotos de perfil serão salvas
const PASTA_UPLOADS = path.join(process.cwd(), 'uploads', 'fotos');
fs.mkdirSync(PASTA_UPLOADS, { recursive: true });

@Controller('api/usuarios')
export class UsuariosController {
  constructor(private readonly usuariosService: UsuariosService) {}

  // ============================================
  // RN011, RN012 — VER O PRÓPRIO PERFIL
  // ============================================
  @Get('me')
  @UseGuards(AuthGuard)
  meuPerfil(@UsuarioAtual() usuario: JwtPayload) {
    return this.usuariosService.meuPerfil(usuario.id);
  }

  // ============================================
  // RN012, RN013, RN014, RN021, RN022, RN024, RN025 — EDITAR PRÓPRIO PERFIL
  // ============================================
  @Put('me')
  @UseGuards(AuthGuard)
  atualizarPerfil(@UsuarioAtual() usuario: JwtPayload, @Body() dto: AtualizarPerfilDto) {
    return this.usuariosService.atualizarPerfil(usuario.id, dto);
  }

  // ============================================
  // RN015, RN016, RN023, RN024, RN-025, RN-027 — ALTERAR FOTO
  // ============================================
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
      limits: { fileSize: 5 * 1024 * 1024 }, // RN016/RN-027 — 5MB
      fileFilter: (req, file, cb) => {
        const tiposPermitidos = ['image/jpeg', 'image/png', 'image/webp']; // RN015/RN-025
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

  // ============================================
  // RN020, RN-011, RN-015 — DESATIVAR CONTA (exige senha atual)
  // ============================================
  @Put('me/desativar')
  @UseGuards(AuthGuard)
  desativarConta(
    @UsuarioAtual() usuario: JwtPayload,
    @Body() dto: SenhaAtualDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    return this.usuariosService.desativarConta(usuario.id, dto.senha_atual, res, usuario.jti);
  }

  // RN086 — administradores poderão bloquear/desbloquear usuários
  @Put(':id/ativo')
  @UseGuards(AuthGuard, AdminGuard)
  alterarAtivo(
    @UsuarioAtual() admin: JwtPayload,
    @Param('id') id: string,
    @Body() dto: AlterarAtivoDto,
  ) {
    return this.usuariosService.alterarAtivo(admin.id, Number(id), dto.ativa);
  }

  // RN-012 — admin altera o papel de um usuário (usuario/prestador/admin)
  @Put(':id/papel')
  @UseGuards(AuthGuard, AdminGuard)
  alterarPapel(
    @UsuarioAtual() admin: JwtPayload,
    @Param('id') id: string,
    @Body() dto: AlterarPapelDto,
  ) {
    return this.usuariosService.alterarPapel(admin.id, Number(id), dto.role);
  }

  // ============================================
  // RN017, RN018, RN-011, RN-015 — EXCLUIR CONTA (LGPD, exige senha atual)
  // ============================================
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
