
import {
    Body,
    Controller,
    Get,
    Patch,
    Post,
    Req,
    UseGuards
} from '@nestjs/common';

import { UsuariosService } from './usuarios.service';

import { CreateUsuarioDto } from './dto/create-usuario.dto';
import { UpdateUsuarioDto } from './dto/update-usuario.dto';

import { AuthGuard } from '../auth/auth.guard';

@Controller('usuarios')
export class UsuariosController {

    constructor(
        private readonly usuariosService: UsuariosService
    ) {}


    @Post()
    criarUsuario(
        @Body() dados: CreateUsuarioDto
    ) {

        return this.usuariosService.criarUsuario(
            dados
        );

    }


    @Get('perfil')
    @UseGuards(AuthGuard)
    buscarPerfil(
        @Req() request: any
    ) {

        return this.usuariosService.buscarPerfil(
            request.usuario.sub
        );

    }


    @Patch('perfil')
    @UseGuards(AuthGuard)
    atualizarPerfil(
        @Req() request: any,
        @Body() dados: UpdateUsuarioDto
    ) {

        return this.usuariosService.atualizarPerfil(
            request.usuario.sub,
            dados
        );

    }

}

