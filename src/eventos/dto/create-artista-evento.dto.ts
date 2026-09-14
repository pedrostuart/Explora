import {
    IsNotEmpty,
    IsString,
    IsUrl,
    MaxLength,
} from 'class-validator';

export class CreateArtistaEventoDto {

    @IsString()
    @IsNotEmpty()
    @MaxLength(250)
    nome: string;

    @IsUrl()
    @IsNotEmpty()
    @MaxLength(500)
    imagem: string;
}