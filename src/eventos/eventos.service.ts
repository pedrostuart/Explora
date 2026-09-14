import { Injectable, NotFoundException } from '@nestjs/common';
import { ResultSetHeader, RowDataPacket } from 'mysql2';

import { CreateEventoDto } from './dto/create-evento.dto';
import { UpdateEventoDto } from './dto/update-evento.dto';
import { DatabaseService } from '../database/database.service';

@Injectable()
export class EventosService {
    constructor(
        private readonly databaseService: DatabaseService
    ) {}

    // CRIAR EVENTO
    async criarEvento(createEventoDto: CreateEventoDto) {
        const {
            nome_evento,
            descricao,
            data,
            hora_inicio,
            hora_fim,
            logradouro,
            numero_local,
            cidade,
            estado,
            capacidade,
            classificacao_etaria,
            destaque_evento,
            imagem,
            link_compra,
            categorias,
            artistas,
            ingressos
        } = createEventoDto;

        // Criar evento
        const sql = `
            INSERT INTO eventos (
                nome_evento,
                descricao,
                data,
                hora_inicio,
                hora_fim,
                logradouro,
                numero_local,
                cidade,
                estado,
                capacidade,
                classificacao_etaria,
                destaque_evento,
                imagem,
                link_compra
            )
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `;

        const resultado = await this.databaseService.query(
            sql,
            [
                nome_evento,
                descricao,
                data,
                hora_inicio,
                hora_fim,
                logradouro,
                numero_local,
                cidade,
                estado,
                capacidade,
                classificacao_etaria,
                destaque_evento,
                imagem,
                link_compra
            ]
        ) as ResultSetHeader;

        const eventoId = resultado.insertId;

        // Adicionar categorias
        if (categorias) {
            for (const categoriaId of categorias) {
                await this.databaseService.query(
                    `
                        INSERT INTO evento_categoria (
                            evento_id,
                            categoria_id
                        )
                        VALUES (?, ?)
                    `,
                    [eventoId, categoriaId]
                );
            }
        }

        // Adicionar artistas
        if (artistas) {
            for (const artista of artistas) {
                const artistaExistente = await this.databaseService.query(
                    `
                        SELECT id
                        FROM artistas
                        WHERE nome = ?
                    `,
                    [artista.nome]
                ) as RowDataPacket[];

                let artistaId: number;

                if (artistaExistente.length > 0) {
                    // Artista já existe
                    artistaId = artistaExistente[0].id;
                } else {
                    // Criar artista
                    const resultadoArtista = await this.databaseService.query(
                        `
                            INSERT INTO artistas (
                                nome,
                                imagem
                            )
                            VALUES (?, ?)
                        `,
                        [artista.nome, artista.imagem]
                    ) as ResultSetHeader;

                    artistaId = resultadoArtista.insertId;
                }

                // Relacionar artista com evento
                await this.databaseService.query(
                    `
                        INSERT INTO evento_artista (
                            evento_id,
                            artista_id
                        )
                        VALUES (?, ?)
                    `,
                    [eventoId, artistaId]
                );
            }
        }

        // Adicionar ingressos
        if (ingressos) {
            for (const ingresso of ingressos) {
                await this.databaseService.query(
                    `
                        INSERT INTO ingressos (
                            evento_id,
                            nome_ingresso,
                            preco,
                            status
                        )
                        VALUES (?, ?, ?, ?)
                    `,
                    [
                        eventoId,
                        ingresso.nome_ingresso,
                        ingresso.preco,
                        ingresso.status
                    ]
                );
            }
        }

        return {
            mensagem: 'Evento cadastrado com sucesso',
            evento: {
                id: eventoId,
                nome_evento,
                descricao,
                data,
                hora_inicio,
                hora_fim,
                logradouro,
                numero_local,
                cidade,
                estado,
                capacidade,
                classificacao_etaria,
                destaque_evento,
                imagem,
                link_compra,
                categorias: categorias || [],
                artistas: artistas || [],
                ingressos: ingressos || []
            }
        };
    }

    // LISTAR TODOS
    async listarTodos() {
        const eventos = await this.databaseService.query(
            `SELECT * FROM eventos ORDER BY data ASC`
        ) as RowDataPacket[];

        const eventosCompletos = await Promise.all(
            eventos.map(async (evento) => {
                const categorias = await this.databaseService.query(
                    `
                        SELECT c.id, c.nome
                        FROM evento_categoria ec
                        INNER JOIN categorias c ON c.id = ec.categoria_id
                        WHERE ec.evento_id = ?
                    `,
                    [evento.id]
                ) as RowDataPacket[];

                const artistas = await this.databaseService.query(
                    `
                        SELECT a.id, a.nome, a.imagem
                        FROM evento_artista ea
                        INNER JOIN artistas a ON a.id = ea.artista_id
                        WHERE ea.evento_id = ?
                    `,
                    [evento.id]
                ) as RowDataPacket[];

                const ingressos = await this.databaseService.query(
                    `
                        SELECT id, nome_ingresso, preco, status
                        FROM ingressos
                        WHERE evento_id = ?
                    `,
                    [evento.id]
                ) as RowDataPacket[];

                return {
                    ...evento,
                    categorias,
                    artistas,
                    ingressos
                };
            })
        );

        return eventosCompletos;
    }

    // BUSCAR POR ID
    async buscarPorId(id: number) {
        // Buscar os dados principais do evento
        const resultado = await this.databaseService.query(
            `
                SELECT *
                FROM eventos
                WHERE id = ?
            `,
            [id]
        ) as RowDataPacket[];

        if (resultado.length === 0) {
            throw new NotFoundException('Evento não encontrado');
        }

        const evento = resultado[0];

        // Buscar categorias
        const categorias = await this.databaseService.query(
            `
                SELECT c.id, c.nome
                FROM evento_categoria ec
                INNER JOIN categorias c ON c.id = ec.categoria_id
                WHERE ec.evento_id = ?
            `,
            [id]
        ) as RowDataPacket[];

        // Buscar artistas
        const artistas = await this.databaseService.query(
            `
                SELECT a.id, a.nome, a.imagem
                FROM evento_artista ea
                INNER JOIN artistas a ON a.id = ea.artista_id
                WHERE ea.evento_id = ?
            `,
            [id]
        ) as RowDataPacket[];

        // Buscar ingressos
        const ingressos = await this.databaseService.query(
            `
                SELECT id, nome_ingresso, preco, status
                FROM ingressos
                WHERE evento_id = ?
            `,
            [id]
        ) as RowDataPacket[];

        // Retornar tudo
        return {
            ...evento,
            categorias,
            artistas,
            ingressos
        };
    }

    // ATUALIZAR EVENTO
    async atualizar(id: number, dados: UpdateEventoDto) {
        // Verificar se o evento existe
        await this.buscarPorId(id);

        // Atualizar dados principais do evento
        await this.databaseService.query(
            `
                UPDATE eventos SET
                    nome_evento = ?,
                    descricao = ?,
                    data = ?,
                    hora_inicio = ?,
                    hora_fim = ?,
                    logradouro = ?,
                    numero_local = ?,
                    cidade = ?,
                    estado = ?,
                    capacidade = ?,
                    classificacao_etaria = ?,
                    destaque_evento = ?,
                    imagem = ?,
                    link_compra = ?
                WHERE id = ?
            `,
            [
                dados.nome_evento,
                dados.descricao,
                dados.data,
                dados.hora_inicio,
                dados.hora_fim,
                dados.logradouro,
                dados.numero_local,
                dados.cidade,
                dados.estado,
                dados.capacidade,
                dados.classificacao_etaria,
                dados.destaque_evento,
                dados.imagem,
                dados.link_compra,
                id
            ]
        );

        // ATUALIZAR CATEGORIAS
        if (dados.categorias !== undefined) {
            // Remover categorias antigas
            await this.databaseService.query(
                `
                    DELETE FROM evento_categoria
                    WHERE evento_id = ?
                `,
                [id]
            );

            // Adicionar novas categorias
            for (const categoriaId of dados.categorias) {
                await this.databaseService.query(
                    `
                        INSERT INTO evento_categoria (
                            evento_id,
                            categoria_id
                        )
                        VALUES (?, ?)
                    `,
                    [id, categoriaId]
                );
            }
        }

        // ATUALIZAR ARTISTAS
        if (dados.artistas !== undefined) {
            // Remover artistas antigos do evento
            await this.databaseService.query(
                `
                    DELETE FROM evento_artista
                    WHERE evento_id = ?
                `,
                [id]
            );

            // Adicionar os novos artistas
            for (const artista of dados.artistas) {
                const artistaExistente = await this.databaseService.query(
                    `
                        SELECT id
                        FROM artistas
                        WHERE nome = ?
                    `,
                    [artista.nome]
                ) as RowDataPacket[];

                let artistaId: number;

                if (artistaExistente.length > 0) {
                    // Artista já existe
                    artistaId = artistaExistente[0].id;
                } else {
                    // Criar artista
                    const resultadoArtista = await this.databaseService.query(
                        `
                            INSERT INTO artistas (
                                nome,
                                imagem
                            )
                            VALUES (?, ?)
                        `,
                        [artista.nome, artista.imagem]
                    ) as ResultSetHeader;

                    artistaId = resultadoArtista.insertId;
                }

                // Relacionar artista com evento
                await this.databaseService.query(
                    `
                        INSERT INTO evento_artista (
                            evento_id,
                            artista_id
                        )
                        VALUES (?, ?)
                    `,
                    [id, artistaId]
                );
            }
        }

        // ATUALIZAR INGRESSOS
        if (dados.ingressos !== undefined) {
            // Remover ingressos antigos
            await this.databaseService.query(
                `
                    DELETE FROM ingressos
                    WHERE evento_id = ?
                `,
                [id]
            );

            // Criar os novos ingressos
            for (const ingresso of dados.ingressos) {
                await this.databaseService.query(
                    `
                        INSERT INTO ingressos (
                            evento_id,
                            nome_ingresso,
                            preco,
                            status
                        )
                        VALUES (?, ?, ?, ?)
                    `,
                    [
                        id,
                        ingresso.nome_ingresso,
                        ingresso.preco,
                        ingresso.status
                    ]
                );
            }
        }

        return {
            mensagem: 'Evento atualizado com sucesso',
            evento: {
                id,
                nome_evento: dados.nome_evento,
                descricao: dados.descricao,
                data: dados.data,
                hora_inicio: dados.hora_inicio,
                hora_fim: dados.hora_fim,
                logradouro: dados.logradouro,
                numero_local: dados.numero_local,
                cidade: dados.cidade,
                estado: dados.estado,
                capacidade: dados.capacidade,
                classificacao_etaria: dados.classificacao_etaria,
                destaque_evento: dados.destaque_evento,
                imagem: dados.imagem,
                link_compra: dados.link_compra,
                categorias: dados.categorias || [],
                artistas: dados.artistas || [],
                ingressos: dados.ingressos || []
            }
        };
    }

    // REMOVER EVENTO
    async remover(id: number) {
        await this.buscarPorId(id);

        await this.databaseService.query(
            `
                DELETE FROM eventos
                WHERE id = ?
            `,
            [id]
        );
        return {
            mensagem: `Evento ${id} excluído com sucesso`
        };
    }
}

