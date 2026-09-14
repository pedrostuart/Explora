import {
    IsNotEmpty,
    IsOptional,
    IsString,
    IsUrl,
    MaxLength,
} from 'class-validator';

export class UpdateArtistaDto {

    @IsOptional()
    @IsString()
    @IsNotEmpty()
    @MaxLength(250)
    nome: string;

    @IsOptional()
    @IsUrl()
    @MaxLength(500)
    @IsNotEmpty()
    imagem: string;
}