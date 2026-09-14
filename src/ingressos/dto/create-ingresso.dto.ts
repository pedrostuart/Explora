import {
    IsInt,
    IsNotEmpty,
    IsNumber,
    IsString,
    Min,
    MaxLength,
} from 'class-validator';

export class CreateIngressoDto {

    @IsInt()
    @Min(1)
    evento_id: number;

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