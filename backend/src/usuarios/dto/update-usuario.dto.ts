
import {
    IsEmail,
    IsNotEmpty,
    IsString,
    MaxLength
} from 'class-validator';

export class UpdateUsuarioDto {

    @IsString()
    @IsNotEmpty()
    @MaxLength(240)
    nome: string;

    @IsString()
    @IsNotEmpty()
    @MaxLength(240)
    sobrenome: string;

    @IsEmail()
    @IsNotEmpty()
    @MaxLength(140)
    email: string;

    @IsString()
    @IsNotEmpty()
    @MaxLength(15)
    telefone: string;

    @IsString()
    @IsNotEmpty()
    @MaxLength(100)
    estado: string;

}

