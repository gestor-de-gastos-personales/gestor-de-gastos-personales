import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateGastoDto } from './dto/create-gasto.dto.js';
import { UpdateGastoDto } from './dto/update-gasto.dto.js';
import { PrismaService } from '../prisma/prisma.service.js';

@Injectable()
export class GastosService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createGastoDto: CreateGastoDto) {

    // 1. Verificar si la categoría existe antes de crear
    const categoriaExiste = await this.prisma.categoria.findUnique({
      where: { id: createGastoDto.categoria },
    });

    if (!categoriaExiste) {
      throw new NotFoundException(`La categoría con ID #${createGastoDto.categoria} no existe`);
    }
    
    return this.prisma.gasto.create({
      data: {
        descripcion: createGastoDto.descripcion,
        valor: createGastoDto.valor,
        id_categoria_fk: createGastoDto.categoria,
      },
    });
    
  }

  async findAll() {
    return await this.prisma.gasto.findMany({
      include: {
        categoria: true,
      },
    });
  }

  async findOne(id: number) {
    const gasto = await this.prisma.gasto.findUnique({
      where: { id },
      include: {
        categoria: true,
      },
    });

    if (!gasto) {
      throw new NotFoundException(`Gasto con ID #${id} no encontrado`);
    }

    return gasto;
  }

  async update(id: number, updateGastoDto: UpdateGastoDto) {
    await this.findOne(id);

    return await this.prisma.gasto.update({
      where: { id },
      data: {
        descripcion: updateGastoDto.descripcion,
        valor: updateGastoDto.valor,
        id_categoria_fk: updateGastoDto.categoria,
      },
    });
  }

  async remove(id: number) {
    await this.findOne(id);

    return await this.prisma.gasto.delete({
      where: { id },
    });
  }
}