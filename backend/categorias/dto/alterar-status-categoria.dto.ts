import { Type } from 'class-transformer';
import { IsIn } from 'class-validator';

export class AlterarStatusCategoriaDto {
  @Type(() => Number)
  @IsIn([0, 1], { message: 'Campo "ativa" deve ser 0 ou 1.' })
  ativa: number;
}
