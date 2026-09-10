import { Injectable, NotFoundException } from '@nestjs/common';
import { ResultSetHeader, RowDataPacket } from 'mysql2';
import { DatabaseService } from '../database/database.service';
import { CreateCategoriaDto } from './dto/create-categoria.dto';
import { UpdateCategoriaDto } from './dto/update-categoria.dto';

@Injectable()
export class CategoriasService {

    constructor(
        private readonly databaseService: DatabaseService
    ) {}

    async criarCategoria(createCategoriaDto: CreateCategoriaDto) {

        const {
            id,
            nome
        } = createCategoriaDto;

        const sql = `
            INSERT INTO categorias (
                id,
                nome
            )
            VALUES (?, ?)
        `;

        await this.databaseService.query(
            sql,
            [id, nome]
        );

        return {
            mensagem: 'Categoria cadastrada com sucesso',
            categoria: {
                id,
                nome
            }
        };
    }

    async listarTodos() {

        const resultado = await this.databaseService.query(
            'SELECT * FROM categorias'
        );

        return resultado;
    }

    async buscarPorId(id: number) {

        const resultado = await this.databaseService.query(
            'SELECT * FROM categorias WHERE id = ?',
            [id]
        ) as RowDataPacket[];

        if (resultado.length === 0) {
            throw new NotFoundException('Categoria não encontrada');
        }

        return resultado[0];
    }

    async atualizar(
        id: number,
        dados: UpdateCategoriaDto
    ) {

        await this.buscarPorId(id);

        await this.databaseService.query(
            `
            UPDATE categorias SET
                nome = ?
            WHERE id = ?
            `,
            [
                dados.nome,
                id
            ]
        );

        return {
            mensagem: 'Categoria atualizada com sucesso',
            categoria: {
                id,
                nome: dados.nome
            }
        };
    }

    async remover(id: number) {

        await this.buscarPorId(id);

        await this.databaseService.query(
            'DELETE FROM categorias WHERE id = ?',
            [id]
        );

        return {
            mensagem: `Categoria ${id} excluída com sucesso`
        };
    }
}