import {
    Injectable,
    UnauthorizedException
} from '@nestjs/common';

import { JwtService } from '@nestjs/jwt';

import { DatabaseService } from '../database/database.service';

import { LoginDto } from './dto/login.dto';

import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
    constructor(
        private readonly databaseService: DatabaseService,
        private readonly jwtService: JwtService
    ) {}

    async login(dados: LoginDto) {
        const usuarios =
            await this.databaseService.query(
                `
                SELECT *
                FROM usuarios
                WHERE email = ?
                `,
                [dados.email]
            ) as any[];

        if (usuarios.length === 0) {
            throw new UnauthorizedException(
                'E-mail ou senha inválidos'
            );
        }

        const usuario = usuarios[0];

        const senhaValida =
            await bcrypt.compare(
                dados.senha,
                usuario.senha
            );

        if (!senhaValida) {
            throw new UnauthorizedException(
                'E-mail ou senha inválidos'
            );
        }

        const payload = {
            sub: usuario.id,
            email: usuario.email
        };

        const token = await this.jwtService.signAsync(payload);

        return {
            mensagem: 'Login realizado com sucesso',
            token,
            usuario: {
                id: usuario.id,
                nome: usuario.nome,
                sobrenome: usuario.sobrenome,
                email: usuario.email
            }
        };
    }
}