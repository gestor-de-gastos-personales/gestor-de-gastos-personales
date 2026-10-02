import { IsOptional, Matches } from 'class-validator';

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
}