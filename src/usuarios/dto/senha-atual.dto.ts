import { IsNotEmpty } from 'class-validator';

// RN-011 — confirmação de senha exigida para ações sensíveis
// (desativar conta, excluir conta, desabilitar 2FA).
export class SenhaAtualDto {
  @IsNotEmpty({ message: 'Confirme sua senha atual para continuar.' })
  senha_atual: string;
}
