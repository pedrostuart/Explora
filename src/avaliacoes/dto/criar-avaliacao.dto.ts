import { Type } from 'class-transformer';
import { IsInt, Max, Min } from 'class-validator';

export class CriarAvaliacaoDto {
  @Type(() => Number)
  @IsInt()
  @Min(1, { message: 'Nota deve ser entre 1 e 5.' })
  @Max(5, { message: 'Nota deve ser entre 1 e 5.' })
  nota: number;
}
