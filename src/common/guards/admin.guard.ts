import { CanActivate, ExecutionContext, ForbiddenException, Injectable } from '@nestjs/common';

// Equivalente ao middleware exigirAdmin do Express.
// Sempre usado depois do AuthGuard (que preenche request.usuario).
@Injectable()
export class AdminGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();

    if (request.usuario?.role !== 'admin') {
      throw new ForbiddenException({ erro: 'Acesso restrito a administradores.' });
    }

    return true;
  }
}
