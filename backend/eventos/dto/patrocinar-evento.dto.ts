import { Type } from 'class-transformer';
import { IsBoolean } from 'class-validator';

export class PatrocinarEventoDto {
  @Type(() => Boolean)
  @IsBoolean({ message: 'O campo "patrocinado" deve ser verdadeiro ou falso.' })
  patrocinado: boolean;
}
