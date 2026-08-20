import { Transform, Type } from 'class-transformer';
import {
  ArrayMaxSize,
  IsArray,
  IsBoolean,
  IsIn,
  IsInt,
  IsLatitude,
  IsLongitude,
  IsNumber,
  IsOptional,
  IsString,
  IsUrl,
  Length,
  Matches,
  Min,
  ValidateNested,
} from 'class-validator';

import { HorarioFuncionamentoDto } from './horario-funcionamento.dto';

// RN-042/052 — edição de evento (todos os campos opcionais; só o que for
// enviado é alterado, e cada alteração é registrada no histórico de edições
// com autor e timestamp).
export class AtualizarEventoDto {
  @IsOptional()
  @Transform(({ value }) => value?.trim())
  @IsString()
  nome?: string;

  @IsOptional()
  @IsString()
  descricao?: string;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  categoria_id?: number;

  // RN-039 — endereço estruturado (edição parcial: se enviar qualquer parte,
  // o "endereco" de exibição é regerado no service)
  @IsOptional()
  @Matches(/^\d{5}-?\d{3}$/, { message: 'CEP inválido (use o formato 00000-000).' })
  cep?: string;

  @IsOptional()
  @Transform(({ value }) => value?.trim())
  @IsString()
  logradouro?: string;

  @IsOptional()
  @Transform(({ value }) => value?.trim())
  @IsString()
  numero?: string;

  @IsOptional()
  @Transform(({ value }) => value?.trim())
  @IsString()
  bairro?: string;

  @IsOptional()
  @Transform(({ value }) => value?.trim())
  @IsString()
  cidade?: string;

  @IsOptional()
  @Transform(({ value }) => value?.trim().toUpperCase())
  @Length(2, 2)
  estado?: string;

  @IsOptional()
  @Type(() => Number)
  @IsLatitude()
  latitude?: number;

  @IsOptional()
  @Type(() => Number)
  @IsLongitude()
  longitude?: number;

  @IsOptional()
  @IsString()
  data_hora?: string;

  @IsOptional()
  @IsString()
  data_hora_fim?: string;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  capacidade?: number;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  preco?: number;

  @IsOptional()
  @IsUrl()
  imagem_capa?: string;

  @IsOptional()
  @IsUrl()
  link_externo?: string;

  @IsOptional()
  @IsIn(['Livre', '10', '12', '14', '16', '18'])
  classificacao_etaria?: string;

  // RN-036
  @IsOptional()
  @Type(() => Boolean)
  @IsBoolean()
  acessivel_fisico?: boolean;

  @IsOptional()
  @Type(() => Boolean)
  @IsBoolean()
  acessivel_visual?: boolean;

  @IsOptional()
  @Type(() => Boolean)
  @IsBoolean()
  acessivel_auditivo?: boolean;

  // RN-033
  @IsOptional()
  @IsArray()
  @ArrayMaxSize(4)
  @ValidateNested({ each: true })
  @Type(() => HorarioFuncionamentoDto)
  horarios_funcionamento?: HorarioFuncionamentoDto[];
}
