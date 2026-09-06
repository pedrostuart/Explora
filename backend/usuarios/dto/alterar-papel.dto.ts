import { IsIn } from 'class-validator';


export class AlterarPapelDto {
  @IsIn(['usuario', 'prestador', 'admin'], { message: 'Papel inválido.' })
  role: 'usuario' | 'prestador' | 'admin';
}
