import {
    IsInt,
    IsNotEmpty,
    IsNumber,
    IsOptional,
    IsString,
    Min,
    MaxLength,
} from 'class-validator';

export class UpdateIngressoDto {

    @IsOptional()
    @IsInt()
    @Min(1)
    evento_id: number;

    @IsOptional()
    @IsString()
    @IsNotEmpty()
    @MaxLength(200)
    nome_ingresso: string;

    @IsOptional()
    @IsNumber({ maxDecimalPlaces: 2 })
    @Min(0)
    preco: number;

    @IsOptional()
    @IsString()
    @IsNotEmpty()
    @MaxLength(70)
    status: string;
}