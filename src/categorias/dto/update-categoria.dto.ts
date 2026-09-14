import {
    IsNotEmpty,
    IsOptional,
    IsString,
    MaxLength,
} from 'class-validator';

export class UpdateCategoriaDto {

    @IsOptional()
    @IsString()
    @IsNotEmpty()
    @MaxLength(60)
    nome: string;
}