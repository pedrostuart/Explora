import { IsEmail, IsNotEmpty, IsString, Length } from 'class-validator';

export class ConfirmarEmailDto {
  @IsEmail({}, { message: 'O e-mail informado é inválido.' })
  @IsNotEmpty({ message: 'O e-mail é obrigatório.' })
  email: string;

  @IsString()
  @IsNotEmpty({ message: 'O código de confirmação é obrigatório.' })
  @Length(6, 6, { message: 'O código de validação deve ter exatamente 6 dígitos.' })
  token: string;
}
