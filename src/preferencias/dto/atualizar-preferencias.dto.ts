import { ArrayUnique, IsArray, IsInt } from 'class-validator';

export class AtualizarPreferenciasDto {
  @IsArray({ message: 'Envie "categorias" como uma lista de ids.' })
  @IsInt({ each: true, message: 'Cada categoria deve ser um id numérico.' })
  @ArrayUnique({ message: 'A lista de categorias não pode ter ids repetidos.' })
  categorias: number[];
}
