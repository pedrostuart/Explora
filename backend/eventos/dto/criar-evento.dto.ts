import { Transform, Type } from 'class-transformer';
import {
  ArrayMaxSize,
  IsArray,
  IsBoolean,
  IsIn,
  IsInt,
  IsLatitude,
  IsLongitude,
  IsNotEmpty,
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

export class CriarEventoDto {
  @Transform(({ value }) => value?.trim())
  @IsString()
  @IsNotEmpty({ message: 'Nome do evento é obrigatório.' })
  nome: string;

  @IsOptional()
  @IsString()
  descricao?: string;

  @Type(() => Number)
  @IsInt({ message: 'Categoria é obrigatória.' }) 
  categoria_id: number;

  
  
  
  
  @Matches(/^\d{5}-?\d{3}$/, { message: 'CEP inválido (use o formato 00000-000).' })
  cep: string;

  @Transform(({ value }) => value?.trim())
  @IsString()
  @IsNotEmpty({ message: 'Logradouro é obrigatório.' })
  logradouro: string;

  @Transform(({ value }) => value?.trim())
  @IsString()
  @IsNotEmpty({ message: 'Número é obrigatório (use "S/N" se não houver).' })
  numero: string;

  @Transform(({ value }) => value?.trim())
  @IsString()
  @IsNotEmpty({ message: 'Bairro é obrigatório.' })
  bairro: string;

  @Transform(({ value }) => value?.trim())
  @IsString()
  @IsNotEmpty({ message: 'Cidade é obrigatória.' })
  cidade: string;

  @Transform(({ value }) => value?.trim().toUpperCase())
  @Length(2, 2, { message: 'Estado deve ser a sigla de 2 letras (ex: SP).' })
  estado: string;

  
  @Type(() => Number)
  @IsLatitude({ message: 'Latitude inválida.' })
  latitude: number;

  @Type(() => Number)
  @IsLongitude({ message: 'Longitude inválida.' })
  longitude: number;

  @IsNotEmpty({ message: 'Data e horário de início são obrigatórios.' }) 
  data_hora: string;

  
  @IsOptional()
  data_hora_fim?: string;

  @Type(() => Number)
  @IsInt()
  @Min(1, { message: 'Capacidade deve ser maior que zero.' }) 
  capacidade: number;

  @Type(() => Number)
  @IsNumber()
  @Min(0, { message: 'Preço não pode ser negativo.' })
  preco: number;

  @IsOptional()
  @Type(() => Boolean)
  @IsBoolean()
  gratuito?: boolean;

  @IsOptional()
  @Type(() => Boolean)
  @IsBoolean()
  institucional?: boolean;

  
  @IsUrl({}, { message: 'Informe uma URL de imagem válida para a capa do evento.' })
  imagem_capa: string;

  
  @IsOptional()
  @IsUrl({}, { message: 'Link externo inválido.' })
  link_externo?: string;

  
  @IsIn(['Livre', '10', '12', '14', '16', '18'], { message: 'Classificação etária inválida.' })
  classificacao_etaria: string;

  
  @IsOptional()
  @Type(() => Boolean)
  @IsBoolean()
  recorrente?: boolean;

  @IsOptional()
  @IsIn(['diaria', 'semanal', 'mensal'], { message: 'Frequência de recorrência inválida.' })
  frequencia_recorrencia?: 'diaria' | 'semanal' | 'mensal';

  
  
  
  @Type(() => Boolean)
  @IsBoolean({ message: 'Informe explicitamente se o local tem acessibilidade física (true/false).' })
  acessivel_fisico: boolean;

  @Type(() => Boolean)
  @IsBoolean({ message: 'Informe explicitamente se o local tem recursos de acessibilidade visual (true/false).' })
  acessivel_visual: boolean;

  @Type(() => Boolean)
  @IsBoolean({ message: 'Informe explicitamente se o local tem recursos de acessibilidade auditiva (true/false).' })
  acessivel_auditivo: boolean;

  
  
  
  
  @IsOptional()
  @IsArray()
  @ArrayMaxSize(4, { message: 'Informe no máximo um horário por tipo de dia (dias de semana, sábado, domingo, feriado).' })
  @ValidateNested({ each: true })
  @Type(() => HorarioFuncionamentoDto)
  horarios_funcionamento?: HorarioFuncionamentoDto[];
}
