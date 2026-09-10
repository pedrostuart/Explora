
import {
    ConflictException,
    Injectable,
    NotFoundException
} from '@nestjs/common';

import { DatabaseService } from '../database/database.service';

import { CreateUsuarioDto } from './dto/create-usuario.dto';
import { UpdateUsuarioDto } from './dto/update-usuario.dto';

import * as bcrypt from 'bcrypt';

@Injectable()
export class UsuariosService {

    constructor(
        private readonly databaseService: DatabaseService
    ) {}


    async criarUsuario(
        dados: CreateUsuarioDto
    ) {

        const usuarioExistente =
            await this.databaseService.query(
                `
                SELECT id
                FROM usuarios
                WHERE email = ?
                `,
                [dados.email]
            ) as any[];


        if (usuarioExistente.length > 0) {

            throw new ConflictException(
                'Este e-mail já está cadastrado'
            );

        }


        const senhaCriptografada =
            await bcrypt.hash(
                dados.senha,
                10
            );


        const resultado =
            await this.databaseService.query(
                `
                INSERT INTO usuarios (
                    nome,
                    sobrenome,
                    email,
                    telefone,
                    senha,
                    estado,
                    data_nascimento,
                    orcamento,
                    notificacoes_email,
                    alertas_eventos,
                    notificacoes_ofertas
                )
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
                `,
                [
                    dados.nome,
                    dados.sobrenome,
                    dados.email,
                    dados.telefone,
                    senhaCriptografada,
                    dados.estado,
                    dados.data_nascimento,
                    dados.orcamento,
                    dados.notificacoes_email,
                    dados.alertas_eventos,
                    dados.notificacoes_ofertas
                ]
            ) as any;


        return {

            mensagem: 'Usuário cadastrado com sucesso',

            usuario: {
                id: resultado.insertId,
                nome: dados.nome,
                sobrenome: dados.sobrenome,
                email: dados.email
            }

        };

    }


    async buscarPerfil(
        id: number
    ) {

        const usuarios =
            await this.databaseService.query(
                `
                SELECT
                    id,
                    nome,
                    sobrenome,
                    email,
                    telefone,
                    estado,
                    data_nascimento,
                    orcamento,
                    notificacoes_email,
                    alertas_eventos,
                    notificacoes_ofertas
                FROM usuarios
                WHERE id = ?
                `,
                [id]
            ) as any[];


        if (usuarios.length === 0) {

            throw new NotFoundException(
                'Usuário não encontrado'
            );

        }


        return {
            usuario: usuarios[0]
        };

    }


    async atualizarPerfil(
        id: number,
        dados: UpdateUsuarioDto
    ) {

        const emailExistente =
            await this.databaseService.query(
                `
                SELECT id
                FROM usuarios
                WHERE email = ?
                AND id <> ?
                `,
                [
                    dados.email,
                    id
                ]
            ) as any[];


        if (emailExistente.length > 0) {

            throw new ConflictException(
                'Este e-mail já está cadastrado'
            );

        }


        const usuarioExistente =
            await this.databaseService.query(
                `
                SELECT id
                FROM usuarios
                WHERE id = ?
                `,
                [id]
            ) as any[];


        if (usuarioExistente.length === 0) {

            throw new NotFoundException(
                'Usuário não encontrado'
            );

        }


        await this.databaseService.query(
            `
            UPDATE usuarios
            SET
                nome = ?,
                sobrenome = ?,
                email = ?,
                telefone = ?,
                estado = ?
            WHERE id = ?
            `,
            [
                dados.nome,
                dados.sobrenome,
                dados.email,
                dados.telefone,
                dados.estado,
                id
            ]
        );


        return {

            mensagem: 'Perfil atualizado com sucesso'

        };

    }

}

