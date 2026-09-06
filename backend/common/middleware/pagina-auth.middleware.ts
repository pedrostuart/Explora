import { Injectable, NestMiddleware } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import type { NextFunction, Request, Response } from 'express';
import type { DatabaseSync } from 'node:sqlite';
import * as path from 'node:path';

import { DATABASE_CONNECTION } from '../../database/database.constants';
import { SessoesService } from '../sessoes/sessoes.service';
import { Inject } from '@nestjs/common';

const PAGINAS_PUBLICAS = new Set([
  '/',
  '/index.html',
  '/login.html',
  '/cadastro.html',
  '/verificar-conta.html',  
  '/esqueceu-senha.html',
  '/inserir-token.html',
  '/mudar-senha.html',
  '/informacoes_evento.html',
  '/privacidade.html',
  '/termos-de-uso.html',
]);

@Injectable()
export class PaginaAuthMiddleware implements NestMiddleware {
  constructor(
    private readonly jwtService: JwtService,
    private readonly sessoes: SessoesService,
    @Inject(DATABASE_CONNECTION) private readonly db: DatabaseSync,
  ) {}

  use(request: Request, response: Response, next: NextFunction): void {
    const caminho = request.path;

    if (!caminho.endsWith('.html') || PAGINAS_PUBLICAS.has(caminho)) {
      next();
      return;
    }

    const token = request.signedCookies?.token;
    if (!token) {
      response.redirect('/login.html');
      return;
    }

    try {
      const dados = this.jwtService.verify<{ id: number; jti?: string }>(token);
      if (dados.jti && this.sessoes.estaInvalidado(dados.jti)) {
        response.redirect('/login.html');
        return;
      }

      const usuario = this.db
        .prepare('SELECT ativo, email_confirmado FROM usuarios WHERE id = ?')
        .get(dados.id) as { ativo: number; email_confirmado: number } | undefined;

      if (!usuario || usuario.ativo !== 1 || usuario.email_confirmado !== 1) {
        response.redirect('/login.html');
        return;
      }
    } catch {
      response.redirect('/login.html');
      return;
    }

    response.sendFile(path.join(process.cwd(), 'views', path.basename(caminho)));
  }
}
