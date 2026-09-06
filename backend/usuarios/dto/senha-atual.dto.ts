import { IsNotEmpty } from 'class-validator';



export class SenhaAtualDto {
  @IsNotEmpty({ message: 'Confirme sua senha atual para continuar.' })
  senha_atual: string;
}
