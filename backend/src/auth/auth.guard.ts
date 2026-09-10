import {
    CanActivate,
    ExecutionContext,
    Injectable,
    UnauthorizedException
} from '@nestjs/common';

import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthGuard implements CanActivate {

    constructor(
        private readonly jwtService: JwtService
    ) {}


    async canActivate(
        context: ExecutionContext
    ): Promise<boolean> {

        const request =
            context.switchToHttp().getRequest();

        const authorization =
            request.headers.authorization;


        if (!authorization) {

            throw new UnauthorizedException(
                'Token não informado'
            );

        }


        const [tipo, token] =
            authorization.split(' ');


        if (tipo !== 'Bearer' || !token) {

            throw new UnauthorizedException(
                'Token inválido'
            );

        }


        try {

            const payload =
                await this.jwtService.verifyAsync(token);


            request.usuario = payload;

            return true;

        } catch {

            throw new UnauthorizedException(
                'Token inválido ou expirado'
            );

        }

    }

}