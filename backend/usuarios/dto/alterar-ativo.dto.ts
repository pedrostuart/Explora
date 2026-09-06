import { Type } from 'class-transformer';
import { IsIn } from 'class-validator';

export class AlterarAtivoDto {
  @Type(() => Number)
  @IsIn([0, 1], { message: 'O campo "ativa" deve ser 0 ou 1.' })
  ativa: number;
}
