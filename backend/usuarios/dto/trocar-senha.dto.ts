import { IsNotEmpty, IsString, Matches, MinLength } from 'class-validator';




export class TrocarSenhaDto {
  @IsNotEmpty({ message: 'Informe sua senha atual.' })
  senha_atual: string;

  @IsString()
  @MinLength(6, { message: 'A nova senha deve ter pelo menos 6 caracteres.' })
  @Matches(/[A-Z]/, { message: 'A nova senha deve ter pelo menos uma letra maiúscula.' })
  @Matches(/[a-z]/, { message: 'A nova senha deve ter pelo menos uma letra minúscula.' })
  @Matches(/[0-9]/, { message: 'A nova senha deve ter pelo menos um número.' })
  @Matches(/[^A-Za-z0-9]/, { message: 'A nova senha deve ter pelo menos um caractere especial.' })
  nova_senha: string;
}
