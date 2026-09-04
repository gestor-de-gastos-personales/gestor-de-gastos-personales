import { PartialType } from '@nestjs/mapped-types';
import { CreateGastoDto } from './create-gasto.dto.js';

export class UpdateGastoDto extends PartialType(CreateGastoDto) {}
