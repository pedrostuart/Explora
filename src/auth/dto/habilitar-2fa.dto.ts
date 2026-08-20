import { IsNotEmpty } from 'class-validator';

export class Confirmar2faDto {
  @IsNotEmpty({ message: 'Código de verificação é obrigatório.' })
  codigo: string;
}

export class Verificar2faDto {
  @IsNotEmpty({ message: 'Token temporário é obrigatório.' })
  preAuthToken: string;

  @IsNotEmpty({ message: 'Código de verificação é obrigatório.' })
  codigo: string;
}

export class Desabilitar2faDto {
  @IsNotEmpty({ message: 'Confirme sua senha atual para desabilitar o 2FA.' })
  senha_atual: string;
}
