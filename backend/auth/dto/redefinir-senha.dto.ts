import { Transform } from 'class-transformer';
import { IsEmail, IsNotEmpty, Length, Matches } from 'class-validator';

export class RedefinirSenhaDto {
  @Transform(({ value }) => value?.trim())
  @IsEmail()
  email: string;

  @IsNotEmpty()
  token: string;

  
  @Length(6, 200)
  @Matches(/[A-Z]/)
  @Matches(/[a-z]/)
  @Matches(/\d/)
  @Matches(/[\W_]/)
  novaSenha: string;
}
