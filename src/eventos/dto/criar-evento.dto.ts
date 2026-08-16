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
  @IsInt({ message: 'Categoria é obrigatória.' }) // RN-033/037, RN-042 (uma só)
  categoria_id: number;

  // ============================================
  // RN-039 — endereço estruturado (substitui o antigo campo único "endereco",
  // que agora é gerado automaticamente a partir destes campos)
  // ============================================
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

  // RN-029 — geolocalização obrigatória
  @Type(() => Number)
  @IsLatitude({ message: 'Latitude inválida.' })
  latitude: number;

  @Type(() => Number)
  @IsLongitude({ message: 'Longitude inválida.' })
  longitude: number;

  @IsNotEmpty({ message: 'Data e horário de início são obrigatórios.' }) // RN034
  data_hora: string;

  // RN-046 — consistência temporal: se informado, precisa ser depois do início
  @IsOptional()
  data_hora_fim?: string;

  @Type(() => Number)
  @IsInt()
  @Min(1, { message: 'Capacidade deve ser maior que zero.' }) // RN035
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

  // RN-032 — mídia principal (imagem de capa) obrigatória
  @IsUrl({}, { message: 'Informe uma URL de imagem válida para a capa do evento.' })
  imagem_capa: string;

  // RN-040/053 — link externo (site oficial/ingressos), validado sintaticamente
  @IsOptional()
  @IsUrl({}, { message: 'Link externo inválido.' })
  link_externo?: string;

  // RN-050 — classificação etária obrigatória
  @IsIn(['Livre', '10', '12', '14', '16', '18'], { message: 'Classificação etária inválida.' })
  classificacao_etaria: string;

  // RN-047 — eventos recorrentes (opcional)
  @IsOptional()
  @Type(() => Boolean)
  @IsBoolean()
  recorrente?: boolean;

  @IsOptional()
  @IsIn(['diaria', 'semanal', 'mensal'], { message: 'Frequência de recorrência inválida.' })
  frequencia_recorrencia?: 'diaria' | 'semanal' | 'mensal';

  // ============================================
  // RN-036 — declaração explícita de acessibilidade (nunca omitida)
  // ============================================
  @Type(() => Boolean)
  @IsBoolean({ message: 'Informe explicitamente se o local tem acessibilidade física (true/false).' })
  acessivel_fisico: boolean;

  @Type(() => Boolean)
  @IsBoolean({ message: 'Informe explicitamente se o local tem recursos de acessibilidade visual (true/false).' })
  acessivel_visual: boolean;

  @Type(() => Boolean)
  @IsBoolean({ message: 'Informe explicitamente se o local tem recursos de acessibilidade auditiva (true/false).' })
  acessivel_auditivo: boolean;

  // ============================================
  // RN-033 — horários estruturados de funcionamento (opcional: nem todo
  // evento pontual precisa disso, mas o schema já suporta desde já)
  // ============================================
  @IsOptional()
  @IsArray()
  @ArrayMaxSize(4, { message: 'Informe no máximo um horário por tipo de dia (dias de semana, sábado, domingo, feriado).' })
  @ValidateNested({ each: true })
  @Type(() => HorarioFuncionamentoDto)
  horarios_funcionamento?: HorarioFuncionamentoDto[];
}
