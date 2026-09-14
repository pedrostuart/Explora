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

import { CreateIngressoDto } from './dto/create-ingresso.dto';
import { UpdateIngressoDto } from './dto/update-ingresso.dto';
import { IngressosService } from './ingressos.service';

@Controller('ingressos')
export class IngressosController {

    constructor(
        private readonly ingressosService: IngressosService
    ) {}

    @Post()
    criarIngresso(
        @Body() createIngressoDto: CreateIngressoDto
    ) {
        return this.ingressosService.criarIngresso(
            createIngressoDto
        );
    }

    @Get()
    listarTodos() {
        return this.ingressosService.listarTodos();
    }

    @Get('evento/:eventoId')
    listarPorEvento(
        @Param('eventoId', ParseIntPipe) eventoId: number
    ) {
        return this.ingressosService.listarPorEvento(eventoId);
    }

    @Get(':id')
    buscarPorId(
        @Param('id', ParseIntPipe) id: number
    ) {
        return this.ingressosService.buscarPorId(id);
    }

    @Put(':id')
    atualizar(
        @Param('id', ParseIntPipe) id: number,
        @Body() dados: UpdateIngressoDto
    ) {
        return this.ingressosService.atualizar(id, dados);
    }

    @Delete(':id')
    remover(
        @Param('id', ParseIntPipe) id: number
    ) {
        return this.ingressosService.remover(id);
    }
}