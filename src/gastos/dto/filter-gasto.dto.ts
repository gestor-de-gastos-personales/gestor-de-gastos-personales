import { IsOptional, Matches, IsInt, Min } from 'class-validator';
import { Type } from 'class-transformer';

export class FilterGastosDto {
  @IsOptional()
  @Matches(/^([0-2][0-9]|3[01])-(0[1-9]|1[0-2])-\d{4}$/, {
    message: 'fechaInicio debe tener el formato DD-MM-YYYY (ej: 01-10-2026)',
  })
  fechaInicio?: string;

  @IsOptional()
  @Matches(/^([0-2][0-9]|3[01])-(0[1-9]|1[0-2])-\d{4}$/, {
    message: 'fechaFin debe tener el formato DD-MM-YYYY (ej: 31-10-2026)',
  })
  fechaFin?: string;

  @IsOptional()
  @Type(() => Number)
  @IsInt({ message: 'categoriaId debe ser un número entero' })
  categoriaId?: number;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page?: number = 1;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  limit?: number = 10;
}