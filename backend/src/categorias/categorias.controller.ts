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

import { CreateCategoriaDto } from './dto/create-categoria.dto';
import { UpdateCategoriaDto } from './dto/update-categoria.dto';
import { CategoriasService } from './categorias.service';

@Controller('categorias')
export class CategoriasController {

    constructor(
        private readonly categoriasService: CategoriasService
    ) {}

    @Post()
    criarCategoria(
        @Body() createCategoriaDto: CreateCategoriaDto
    ) {
        return this.categoriasService.criarCategoria(
            createCategoriaDto
        );
    }

    @Get()
    listarTodos() {
        return this.categoriasService.listarTodos();
    }

    @Get(':id')
    buscarPorId(
        @Param('id', ParseIntPipe) id: number
    ) {
        return this.categoriasService.buscarPorId(id);
    }

    @Put(':id')
    atualizar(
        @Param('id', ParseIntPipe) id: number,
        @Body() dados: UpdateCategoriaDto
    ) {
        return this.categoriasService.atualizar(id, dados);
    }

    @Delete(':id')
    remover(
        @Param('id', ParseIntPipe) id: number
    ) {
        return this.categoriasService.remover(id);
    }
}