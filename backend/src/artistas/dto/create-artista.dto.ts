import {
    IsNotEmpty,
    IsString,
    IsUrl,
    MaxLength,
} from 'class-validator';

export class CreateArtistaDto {

    @IsString()
    @IsNotEmpty()
    @MaxLength(250)
    nome: string;

    @IsUrl()
    @MaxLength(500)
    @IsNotEmpty()
    imagem: string;
}