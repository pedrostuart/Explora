import { Transform } from 'class-transformer';
import { IsString, Length } from 'class-validator';

export class CriarCategoriaDto {
  @Transform(({ value }) => value?.trim())
  @IsString()
  @Length(2, 60, { message: 'Nome de categoria inválido.' })
  nome: string;
}
