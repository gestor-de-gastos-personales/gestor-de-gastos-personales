import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateGastoDto } from './dto/create-gasto.dto.js';
import { UpdateGastoDto } from './dto/update-gasto.dto.js';
import { PrismaService } from '../prisma/prisma.service.js';

@Injectable()
export class GastosService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createGastoDto: CreateGastoDto) {
    return await this.prisma.gasto.create({
      data: createGastoDto,
    });
  }

  async findAll() {
    return await this.prisma.gasto.findMany();
  }

  async findOne(id: number) {
    const gasto = await this.prisma.gasto.findUnique({
      where: { id },
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
      data: updateGastoDto,
    });
  }

  async remove(id: number) {
    await this.findOne(id);

    return await this.prisma.gasto.delete({
      where: { id },
    });
  }
}