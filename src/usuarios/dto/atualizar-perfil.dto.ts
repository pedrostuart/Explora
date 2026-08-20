import { Transform } from 'class-transformer';
import { IsMobilePhone, IsOptional, IsString, Length } from 'class-validator';

export class AtualizarPerfilDto {
  @IsOptional()
  @Transform(({ value }) => value?.trim())
  @IsString()
  @Length(3, 100, { message: 'Nome deve ter entre 3 e 100 caracteres.' })
  nome?: string;

  @IsOptional()
  @Transform(({ value }) => (value === '' ? undefined : value))
  @IsMobilePhone('pt-BR', {}, { message: 'Telefone inválido.' })
  telefone?: string;

  @IsOptional()
  @Transform(({ value }) => value?.trim())
  @IsString()
  @Length(0, 100)
  cidade?: string;

  @IsOptional()
  @Transform(({ value }) => value?.trim())
  @IsString()
  @Length(0, 500)
  biografia?: string;
}
