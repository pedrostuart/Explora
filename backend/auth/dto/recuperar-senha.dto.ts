import { Transform } from 'class-transformer';
import { IsEmail } from 'class-validator';

export class RecuperarSenhaDto {
  @Transform(({ value }) => value?.trim())
  @IsEmail({}, { message: 'E-mail inválido.' })
  email: string;
}
