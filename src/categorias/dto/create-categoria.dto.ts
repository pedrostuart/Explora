import {
    IsInt,
    IsNotEmpty,
    IsString,
    MaxLength,
} from 'class-validator';

export class CreateCategoriaDto {

    @IsInt()
    id: number;

    @IsString()
    @IsNotEmpty()
    @MaxLength(60)
    nome: string;
}