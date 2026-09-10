import {
    Injectable,
    NotFoundException
} from '@nestjs/common';

import { DatabaseService } from '../database/database.service';

@Injectable()
export class FavoritosService {

    constructor(
        private readonly databaseService: DatabaseService
    ) {}


    // ==============================
    // ADICIONAR FAVORITO
    // ==============================

    async adicionar(
        usuarioId: number,
        eventoId: number
    ) {

        // Verificar se o evento existe

        const evento =
            await this.databaseService.query(
                `
                SELECT id
                FROM eventos
                WHERE id = ?
                `,
                [eventoId]
            ) as any[];


        if (evento.length === 0) {

            throw new NotFoundException(
                'Evento não encontrado'
            );

        }


        // Verificar se já está favoritado

        const favorito =
            await this.databaseService.query(
                `
                SELECT id
                FROM favoritos
                WHERE usuario_id = ?
                AND evento_id = ?
                `,
                [
                    usuarioId,
                    eventoId
                ]
            ) as any[];


        if (favorito.length > 0) {

            return {
                mensagem: 'Evento já está nos favoritos'
            };

        }


        // Adicionar favorito

        await this.databaseService.query(
            `
            INSERT INTO favoritos (
                usuario_id,
                evento_id
            )
            VALUES (?, ?)
            `,
            [
                usuarioId,
                eventoId
            ]
        );


        return {
            mensagem: 'Evento adicionado aos favoritos'
        };

    }


    // ==============================
    // REMOVER FAVORITO
    // ==============================

    async remover(
        usuarioId: number,
        eventoId: number
    ) {

        await this.databaseService.query(
            `
            DELETE FROM favoritos
            WHERE usuario_id = ?
            AND evento_id = ?
            `,
            [
                usuarioId,
                eventoId
            ]
        );


        return {
            mensagem: 'Evento removido dos favoritos'
        };

    }


    // ==============================
    // VERIFICAR FAVORITO
    // ==============================

    async verificar(
        usuarioId: number,
        eventoId: number
    ) {

        const resultado =
            await this.databaseService.query(
                `
                SELECT id
                FROM favoritos
                WHERE usuario_id = ?
                AND evento_id = ?
                `,
                [
                    usuarioId,
                    eventoId
                ]
            ) as any[];


        return {
            favoritado: resultado.length > 0
        };

    }

}