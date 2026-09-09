import { Injectable } from '@nestjs/common';
import { CreateGastoDto } from './dto/create-gasto.dto.js';
import { UpdateGastoDto } from './dto/update-gasto.dto.js';

@Injectable()
export class GastosService {
  create(createGastoDto: CreateGastoDto) {
    return 'Esta acción crea un nuevo gasto';
  }

  findAll() {
    return `Esta acción devuelve todos los gastos`;
  }

  findOne(id: number) {
    return `Esta acción devuelve el gasto con ID #${id}`;
  }

  update(id: number, updateGastoDto: UpdateGastoDto) {
    return `Esta acción actualiza el gasto con ID #${id}`;
  }

  remove(id: number) {
    return `Esta acción elimina el gasto con ID #${id}`;
  }
}
