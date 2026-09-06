import { IsNotEmpty, Length } from 'class-validator';




export class CodigoTotpDto {
  @IsNotEmpty({ message: 'Informe o código do seu aplicativo autenticador.' })
  @Length(6, 6, { message: 'O código deve ter 6 dígitos.' })
  codigo: string;
}
