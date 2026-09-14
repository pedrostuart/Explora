import { Injectable, NotFoundException } from '@nestjs/common';
import { ResultSetHeader, RowDataPacket } from 'mysql2';
import { DatabaseService } from '../database/database.service';
import { CreateArtistaDto } from './dto/create-artista.dto';
import { UpdateArtistaDto } from './dto/update-artista.dto';

@Injectable()
export class ArtistasService {

    constructor(
        private readonly databaseService: DatabaseService
    ) {}

    async criarArtista(createArtistaDto: CreateArtistaDto) {

        const {
            nome,
            imagem
        } = createArtistaDto;

        const sql = `
            INSERT INTO artistas (
                nome,
                imagem
            )
            VALUES (?, ?)
        `;

        const resultado = await this.databaseService.query(
            sql,
            [nome, imagem]
        ) as ResultSetHeader;

        return {
            mensagem: 'Artista cadastrado com sucesso',
            artista: {
                id: resultado.insertId,
                nome,
                imagem
            }
        };
    }

    async listarTodos() {

        const resultado = await this.databaseService.query(
            'SELECT * FROM artistas'
        );

        return resultado;
    }

    async buscarPorId(id: number) {

        const resultado = await this.databaseService.query(
            'SELECT * FROM artistas WHERE id = ?',
            [id]
        ) as RowDataPacket[];

        if (resultado.length === 0) {
            throw new NotFoundException('Artista não encontrado');
        }

        return resultado[0];
    }

    async atualizar(
        id: number,
        dados: UpdateArtistaDto
    ) {

        await this.buscarPorId(id);

        await this.databaseService.query(
            `
            UPDATE artistas SET
                nome = ?,
                imagem = ?
            WHERE id = ?
            `,
            [
                dados.nome,
                dados.imagem,
                id
            ]
        );

        return {
            mensagem: 'Artista atualizado com sucesso',
            artista: {
                id,
                nome: dados.nome,
                imagem: dados.imagem
            }
        };
    }

    async remover(id: number) {

        await this.buscarPorId(id);

        await this.databaseService.query(
            'DELETE FROM artistas WHERE id = ?',
            [id]
        );

        return {
            mensagem: `Artista ${id} excluído com sucesso`
        };
    }
}