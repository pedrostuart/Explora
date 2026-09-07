import { CanActivate, ExecutionContext, Inject, Injectable, UnauthorizedException, ForbiddenException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import type { DatabaseSync } from 'node:sqlite';
import * as crypto from 'node:crypto';

import { DATABASE_CONNECTION } from '../../database/database.constants';
import { JwtPayload } from '../../auth/interfaces/jwt-payload.interface';
import { SessoesService } from '../sessoes/sessoes.service';

const DURACAO_SESSAO_MS = 30 * 60 * 1000; 







@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private readonly jwtService: JwtService,
    private readonly sessoes: SessoesService,
    @Inject(DATABASE_CONNECTION) private readonly db: DatabaseSync,
  ) {}

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const response = context.switchToHttp().getResponse();

    
    
    const token = request.signedCookies?.token;

    if (!token) {
      throw new UnauthorizedException({ erro: 'É necessário estar logado.' });
    }

    let dados: JwtPayload;
    try {
      dados = this.jwtService.verify<JwtPayload>(token);
    } catch (e) {
      throw new UnauthorizedException({ erro: 'Sessão inválida ou expirada.' });
    }

    
    if (dados.jti && this.sessoes.estaInvalidado(dados.jti)) {
      throw new UnauthorizedException({ erro: 'Sessão finalizada. Faça login novamente.' });
    }

    const usuario = this.db
      .prepare('SELECT ativo, email_confirmado, role FROM usuarios WHERE id = ?')
      .get(dados.id) as { ativo: number; email_confirmado: number; role: string } | undefined;

    if (!usuario || usuario.ativo !== 1) {
      throw new ForbiddenException({ erro: 'Conta desativada ou inválida.' });
    }
    if (usuario.email_confirmado !== 1) {
      throw new ForbiddenException({ erro: 'Confirme seu e-mail antes de continuar.' });
    }

    request.usuario = { id: dados.id, email: dados.email, role: usuario.role as any, jti: dados.jti };

    
    
    
    const novoJti = crypto.randomUUID();
    const novoToken = this.jwtService.sign(
      { id: dados.id, email: dados.email, role: usuario.role, jti: novoJti },
      { expiresIn: '30m' },
    );
    response.cookie('token', novoToken, {
      httpOnly: true,
      sameSite: 'lax',
      signed: true,
      maxAge: DURACAO_SESSAO_MS,
    });

    return true;
  }
}
