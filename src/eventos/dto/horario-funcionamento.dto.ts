import { IsBoolean, IsIn, IsOptional, Matches, ValidateIf } from 'class-validator';

// RN-033 — horário estruturado para um "tipo de dia" (dias de semana,
// sábado, domingo ou feriado). Usado para calcular "Aberto agora"/"Fechado"
// (RN-034).
export class HorarioFuncionamentoDto {
  @IsIn(['dias_semana', 'sabado', 'domingo', 'feriado'], { message: 'Tipo de dia inválido.' })
  tipo_dia: 'dias_semana' | 'sabado' | 'domingo' | 'feriado';

  @IsOptional()
  @IsBoolean()
  fechado?: boolean;

  @ValidateIf((o) => !o.fechado)
  @Matches(/^([01]\d|2[0-3]):[0-5]\d$/, { message: 'Hora de abertura inválida (use HH:MM).' })
  hora_abertura?: string;

  @ValidateIf((o) => !o.fechado)
  @Matches(/^([01]\d|2[0-3]):[0-5]\d$/, { message: 'Hora de fechamento inválida (use HH:MM).' })
  hora_fechamento?: string;
}
