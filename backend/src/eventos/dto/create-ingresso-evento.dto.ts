import {
    IsNotEmpty,
    IsNumber,
    IsString,
    MaxLength,
    Min,
} from 'class-validator';

export class CreateIngressoEventoDto {
    @IsString()
    @IsNotEmpty()
    @MaxLength(200)
    nome_ingresso: string;

    @IsNumber({ maxDecimalPlaces: 2 })
    @Min(0)
    preco: number;

    @IsString()
    @IsNotEmpty()
    @MaxLength(70)
    status: string;
}