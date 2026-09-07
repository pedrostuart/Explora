import { Equals, IsBoolean, IsEmail, IsNotEmpty, IsOptional, IsString, MinLength } from 'class-validator';
import { Type } from 'class-transformer';
import { IsAdult } from '../decorators/is-adult.decorator';

export class CadastroDto {
  @IsString()
  @IsNotEmpty({ message: 'O nome é obrigatório.' })
  nome: string;

  @IsString()
  @IsOptional()
  nome_usuario?: string;

  @IsEmail({}, { message: 'O e-mail informado é inválido.' })
  email: string;

  @IsString()
  @MinLength(6, { message: 'A senha deve ter pelo menos 6 caracteres.' })
  senha: string;

  @IsString()
  @IsOptional()
  telefone?: string;

  @IsNotEmpty({ message: 'A data de nascimento é obrigatória.' })
  @IsAdult({ message: 'Você deve ter pelo menos 18 anos para se cadastrar.' })
  data_nascimento: string;

  
  @Type(() => Boolean)
  @IsBoolean({ message: 'É necessário aceitar os Termos de Uso e a Política de Privacidade.' })
  @Equals(true, { message: 'É necessário aceitar os Termos de Uso e a Política de Privacidade.' })
  aceitou_termos: boolean;
}
