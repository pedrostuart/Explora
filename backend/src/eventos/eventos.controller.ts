import {
    Controller,
    Body,
    Post,
    ParseIntPipe,
    Param,
    Put,
    Delete,
    Get
} from '@nestjs/common';

import { CreateEventoDto } from './dto/create-evento.dto';
import { UpdateEventoDto } from './dto/update-evento.dto';
import { EventosService } from './eventos.service';

@Controller('eventos')
export class EventosController {
    constructor(
        private readonly eventosService: EventosService
    ) {}

    @Post()
    criarEvento(@Body() createEventoDto: CreateEventoDto) {
        return this.eventosService.criarEvento(createEventoDto);
    }

    @Get()
    listarTodos() {
        return this.eventosService.listarTodos();
    }

    @Get(':id')
    buscaPorID(
        @Param('id', ParseIntPipe) id: number
    ) {
        return this.eventosService.buscarPorId(id);
    }

    @Put(':id')
    atualizar(
        @Param('id', ParseIntPipe) id: number,
        @Body() dados: UpdateEventoDto
    ) {
        return this.eventosService.atualizar(id, dados);
    }

    @Delete(':id')
    remover(
        @Param('id', ParseIntPipe) id: number
    ) {
        return this.eventosService.remover(id);
    }
}