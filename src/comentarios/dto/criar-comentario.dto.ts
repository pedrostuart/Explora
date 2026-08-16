import { Transform } from 'class-transformer';
import { IsNotEmpty, IsString, MaxLength } from 'class-validator';

export class CriarComentarioDto {
  @Transform(({ value }) => (typeof value === 'string' ? value.trim() : value))
  @IsString()
  @IsNotEmpty({ message: 'O comentário não pode estar vazio.' }) // RN-076
  @MaxLength(500, { message: 'Comentário excede o limite de 500 caracteres.' }) // RN-077
  texto: string;
}
