import {
    IsString,
    IsNotEmpty,
    IsDateString,
    IsInt,
    IsUrl,
    Min,
    MaxLength,
    IsArray,
    ValidateNested,
    IsOptional,
} from 'class-validator';

import { Type } from 'class-transformer';
import { CreateIngressoEventoDto } from './create-ingresso-evento.dto';
import { CreateArtistaEventoDto } from './create-artista-evento.dto';

export class CreateEventoDto {
    @IsString()
    @IsNotEmpty()
    @MaxLength(240)
    nome_evento: string;

    @IsString()
    @IsNotEmpty()
    descricao: string;

    @IsDateString()
    data: string;

    @IsString()
    @IsNotEmpty()
    hora_inicio: string;

    @IsString()
    @IsNotEmpty()
    hora_fim: string;

    @IsString()
    @IsNotEmpty()
    @MaxLength(240)
    logradouro: string;

    @IsInt()
    @Min(1)
    numero_local: number;

    @IsString()
    @IsNotEmpty()
    @MaxLength(240)
    cidade: string;

    @IsString()
    @IsNotEmpty()
    @MaxLength(240)
    estado: string;

    @IsInt()
    @Min(1)
    capacidade: number;

    @IsInt()
    @Min(0)
    classificacao_etaria: number;

    @IsString()
    @IsNotEmpty()
    @MaxLength(200)
    destaque_evento: string;

    @IsUrl()
    @MaxLength(500)
    imagem: string;

    @IsUrl()
    @MaxLength(500)
    @IsNotEmpty()
    link_compra: string;

    @IsOptional()
    @IsArray()
    @IsInt({ each: true })
    @Min(1, { each: true })
    categorias: number[];

    @IsOptional()
    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => CreateArtistaEventoDto)
    artistas: CreateArtistaEventoDto[];    
    
    @IsOptional()
    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => CreateIngressoEventoDto)
    ingressos: CreateIngressoEventoDto[];
}