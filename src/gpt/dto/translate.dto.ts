import { IsOptional, IsString } from 'class-validator';

export class TranslateDto {
  @IsString()
  prompt: string;

  @IsString()
  @IsOptional()
  lang: string; // Obligatoria en el caso de que se quiera hacer una búsqueda por idioma
}
