import { Injectable, NotFoundException } from '@nestjs/common';
import { ResultSetHeader, RowDataPacket } from 'mysql2';
import { DatabaseService } from '../database/database.service';
import { CreateIngressoDto } from './dto/create-ingresso.dto';
import { UpdateIngressoDto } from './dto/update-ingresso.dto';

@Injectable()
export class IngressosService {
    constructor(
        private readonly databaseService: DatabaseService
    ) {}

    async criarIngresso(createIngressoDto: CreateIngressoDto) {

        const {
            evento_id,
            nome_ingresso,
            preco,
            status
        } = createIngressoDto;

        const sql = `
            INSERT INTO ingressos (
                evento_id,
                nome_ingresso,
                preco,
                status
            )
            VALUES (?, ?, ?, ?)
        `;

        const resultado = await this.databaseService.query(
            sql,
            [
                evento_id,
                nome_ingresso,
                preco,
                status
            ]
        ) as ResultSetHeader;

        return {
            mensagem: 'Ingresso cadastrado com sucesso',
            ingresso: {
                id: resultado.insertId,
                evento_id,
                nome_ingresso,
                preco,
                status
            }
        };
    }

    async listarTodos() {

        const resultado = await this.databaseService.query(
            'SELECT * FROM ingressos'
        );

        return resultado;
    }

    async buscarPorId(id: number) {

        const resultado = await this.databaseService.query(
            'SELECT * FROM ingressos WHERE id = ?',
            [id]
        ) as RowDataPacket[];

        if (resultado.length === 0) {
            throw new NotFoundException('Ingresso não encontrado');
        }

        return resultado[0];
    }

    async listarPorEvento(eventoId: number) {

        const resultado = await this.databaseService.query(
            'SELECT * FROM ingressos WHERE evento_id = ?',
            [eventoId]
        );

        return resultado;
    }

    async atualizar(
        id: number,
        dados: UpdateIngressoDto
    ) {

        await this.buscarPorId(id);

        await this.databaseService.query(
            `
            UPDATE ingressos SET
                evento_id = ?,
                nome_ingresso = ?,
                preco = ?,
                status = ?
            WHERE id = ?
            `,
            [
                dados.evento_id,
                dados.nome_ingresso,
                dados.preco,
                dados.status,
                id
            ]
        );

        return {
            mensagem: 'Ingresso atualizado com sucesso',
            ingresso: {
                id,
                evento_id: dados.evento_id,
                nome_ingresso: dados.nome_ingresso,
                preco: dados.preco,
                status: dados.status
            }
        };
    }

    async remover(id: number) {

        await this.buscarPorId(id);

        await this.databaseService.query(
            'DELETE FROM ingressos WHERE id = ?',
            [id]
        );

        return {
            mensagem: `Ingresso ${id} excluído com sucesso`
        };
    }
}