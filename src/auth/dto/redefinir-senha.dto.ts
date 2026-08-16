import { Transform } from 'class-transformer';
import { IsEmail, IsNotEmpty, Length, Matches } from 'class-validator';

export class RedefinirSenhaDto {
  @Transform(({ value }) => value?.trim())
  @IsEmail()
  email: string;

  @IsNotEmpty()
  token: string;

  // RN-005 — mesma política de senha do cadastro (mínimo 6 caracteres)
  @Length(6, 200)
  @Matches(/[A-Z]/)
  @Matches(/[a-z]/)
  @Matches(/\d/)
  @Matches(/[\W_]/)
  novaSenha: string;
}
