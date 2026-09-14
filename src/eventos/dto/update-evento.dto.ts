import {
    IsString,
    IsOptional,
    IsDateString,
    IsInt,
    IsUrl,
    Min,
    MaxLength,
    IsArray,
    ValidateNested,
} from 'class-validator';

import { Type } from 'class-transformer';
import { CreateIngressoEventoDto } from './create-ingresso-evento.dto';
import { CreateArtistaEventoDto } from './create-artista-evento.dto';

export class UpdateEventoDto {
    @IsOptional()
    @IsString()
    @MaxLength(240)
    nome_evento: string;

    @IsOptional()
    @IsString()
    descricao: string;

    @IsOptional()
    @IsDateString()
    data: string;

    @IsOptional()
    @IsString()
    hora_inicio: string;

    @IsOptional()
    @IsString()
    hora_fim: string;

    @IsOptional()
    @IsString()
    @MaxLength(240)
    logradouro: string;

    @IsOptional()
    @IsInt()
    @Min(1)
    numero_local: number;

    @IsOptional()
    @IsString()
    @MaxLength(240)
    cidade: string;

    @IsOptional()
    @IsString()
    @MaxLength(240)
    estado: string;

    @IsOptional()
    @IsInt()
    @Min(1)
    capacidade: number;

    @IsOptional()
    @IsInt()
    @Min(0)
    classificacao_etaria: number;

    @IsOptional()
    @IsString()
    @MaxLength(200)
    destaque_evento: string;

    @IsOptional()
    @IsUrl()
    @MaxLength(500)
    imagem: string;

    @IsOptional()
    @IsUrl()
    @MaxLength(500)
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