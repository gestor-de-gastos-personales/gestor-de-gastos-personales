import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateGastoDto } from './dto/create-gasto.dto.js';
import { UpdateGastoDto } from './dto/update-gasto.dto.js';
import { FilterGastosDto } from './dto/filter-gasto.dto.js';
import { PrismaService } from '../prisma/prisma.service.js';
import { Prisma } from '@prisma/client';

@Injectable()
export class GastosService {
  constructor(private readonly prisma: PrismaService) {}

  // Convierte 'DD-MM-YYYY' a Date de JS en formato UTC/ISO
  private parseFechaArg(fechaStr: string, esFinDeDia = false): Date {
    const [dia, mes, anio] = fechaStr.split('-');
    const hora = esFinDeDia ? '23:59:59.999Z' : '00:00:00.000Z';
    return new Date(`${anio}-${mes}-${dia}T${hora}`);
  }

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

  async findAll(filterDto?: FilterGastosDto) {
    const where: Prisma.GastoWhereInput = {};

    // 1. Filtro por rango de fechas (DD-MM-YYYY)
    if (filterDto?.fechaInicio || filterDto?.fechaFin) {
      where.fecha = {
        ...(filterDto.fechaInicio && { gte: this.parseFechaArg(filterDto.fechaInicio) }),
        ...(filterDto.fechaFin && { lte: this.parseFechaArg(filterDto.fechaFin, true) }),
      };
    }

    // 2. Filtro por categoría
// 2. Filtro por categoría
    if (filterDto?.categoriaId) {
      where.id_categoria_fk = Number(filterDto.categoriaId); // Convertir string a number
    }

    return await this.prisma.gasto.findMany({
      where,
      include: {
        categoria: true,
      },
      orderBy: {
        fecha: 'desc', // Muestra los registros más recientes primero
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

    // Si actualizan la categoría, verificamos que la nueva exista
    if (updateGastoDto.categoria !== undefined) {
      const categoriaExiste = await this.prisma.categoria.findUnique({
        where: { id: updateGastoDto.categoria },
      });

      if (!categoriaExiste) {
        throw new NotFoundException(`La categoría con ID #${updateGastoDto.categoria} no existe`);
      }
    }

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