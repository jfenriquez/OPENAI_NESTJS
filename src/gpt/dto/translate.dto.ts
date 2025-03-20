import { IsOptional, IsString } from 'class-validator';

export class TranslateDto {
  @IsString()
  readonly prompt: string;

  @IsString()
  @IsOptional()
  readonly lang: string; // Obligatoria en el caso de que se quiera hacer una búsqueda por idioma
}
