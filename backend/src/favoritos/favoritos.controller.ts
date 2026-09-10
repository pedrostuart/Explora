import {
    Controller,
    Delete,
    Get,
    Param,
    ParseIntPipe,
    Post,
    Req,
    UseGuards
} from '@nestjs/common';

import { Request } from 'express';

import { FavoritosService } from './favoritos.service';
import { AuthGuard } from '../auth/auth.guard';

@Controller('favoritos')
@UseGuards(AuthGuard)
export class FavoritosController {

    constructor(
        private readonly favoritosService: FavoritosService
    ) {}


    // ==============================
    // ADICIONAR FAVORITO
    // ==============================

    @Post(':eventoId')
    adicionar(
        @Param('eventoId', ParseIntPipe) eventoId: number,
        @Req() request: any
    ) {

        const usuario =
            (request as any).usuario;

        return this.favoritosService.adicionar(
            usuario.sub,
            eventoId
        );

    }


    // ==============================
    // REMOVER FAVORITO
    // ==============================

    @Delete(':eventoId')
    remover(
        @Param('eventoId', ParseIntPipe) eventoId: number,
        @Req() request: any
    ) {

        const usuario =
            (request as any).usuario;

        return this.favoritosService.remover(
            usuario.sub,
            eventoId
        );

    }


    // ==============================
    // VERIFICAR FAVORITO
    // ==============================

    @Get(':eventoId')
    verificar(
        @Param('eventoId', ParseIntPipe) eventoId: number,
        @Req() request: any
    ) {

        const usuario =
            (request as any).usuario;

        return this.favoritosService.verificar(
            usuario.sub,
            eventoId
        );

    }

}