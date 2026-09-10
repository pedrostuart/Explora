import {
    Body,
    Controller,
    Delete,
    Get,
    Param,
    ParseIntPipe,
    Post,
    Put
} from '@nestjs/common';

import { CreateArtistaDto } from './dto/create-artista.dto';
import { UpdateArtistaDto } from './dto/update-artista.dto';
import { ArtistasService } from './artistas.service';

@Controller('artistas')
export class ArtistasController {

    constructor(
        private readonly artistasService: ArtistasService
    ) {}

    @Post()
    criarArtista(
        @Body() createArtistaDto: CreateArtistaDto
    ) {
        return this.artistasService.criarArtista(
            createArtistaDto
        );
    }

    @Get()
    listarTodos() {
        return this.artistasService.listarTodos();
    }

    @Get(':id')
    buscarPorId(
        @Param('id', ParseIntPipe) id: number
    ) {
        return this.artistasService.buscarPorId(id);
    }

    @Put(':id')
    atualizar(
        @Param('id', ParseIntPipe) id: number,
        @Body() dados: UpdateArtistaDto
    ) {
        return this.artistasService.atualizar(id, dados);
    }

    @Delete(':id')
    remover(
        @Param('id', ParseIntPipe) id: number
    ) {
        return this.artistasService.remover(id);
    }
}