import { IsIn } from 'class-validator';

// RN-012 — perfis de acesso nativos: usuario (turista), prestador, admin.
export class AlterarPapelDto {
  @IsIn(['usuario', 'prestador', 'admin'], { message: 'Papel inválido.' })
  role: 'usuario' | 'prestador' | 'admin';
}
