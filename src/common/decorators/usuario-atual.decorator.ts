import { createParamDecorator, ExecutionContext } from '@nestjs/common';

import { JwtPayload } from '../../auth/interfaces/jwt-payload.interface';

// Equivalente a ler req.usuario nas rotas Express originais
export const UsuarioAtual = createParamDecorator(
  (_data: unknown, ctx: ExecutionContext): JwtPayload => {
    const request = ctx.switchToHttp().getRequest();
    return request.usuario;
  },
);
