import {
    IsBoolean,
    IsDateString,
    IsEmail,
    IsNotEmpty,
    IsNumber,
    IsString,
    MaxLength,
    Min
} from 'class-validator';

export class CreateUsuarioDto {

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
    @MaxLength(240)
    email: string;

    @IsString()
    @IsNotEmpty()
    @MaxLength(15)
    telefone: string;

    @IsString()
    @IsNotEmpty()
    @MaxLength(255)
    senha: string;

    @IsString()
    @IsNotEmpty()
    @MaxLength(240)
    estado: string;

    @IsDateString()
    @IsNotEmpty()
    data_nascimento: string;

    @IsNumber()
    @Min(0)
    orcamento: number;

    @IsBoolean()
    notificacoes_email: boolean;

    @IsBoolean()
    alertas_eventos: boolean;

    @IsBoolean()
    notificacoes_ofertas: boolean;

}