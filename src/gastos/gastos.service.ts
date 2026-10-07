import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateGastoDto } from './dto/create-gasto.dto.js';
import { UpdateGastoDto } from './dto/update-gasto.dto.js';
import { FilterGastosDto } from './dto/filter-gasto.dto.js';
import { PrismaService } from '../prisma/prisma.service.js';
import { FilterResumenDto } from './dto/filter-resumen.dto.js';
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
    const categoriaExiste = await this.prisma.categoria.findUnique({
      where: { id: createGastoDto.categoria },
    });

    if (!categoriaExiste) {
      throw new NotFoundException(
        `La categoría con ID #${createGastoDto.categoria} no existe`,
      );
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
    const { page = 1, limit = 10, fechaInicio, fechaFin, categoriaId } =
      filterDto || {};
    const where: Prisma.GastoWhereInput = {};

    if (fechaInicio || fechaFin) {
      where.fecha = {
        ...(fechaInicio && { gte: this.parseFechaArg(fechaInicio) }),
        ...(fechaFin && { lte: this.parseFechaArg(fechaFin, true) }),
      };
    }

    if (categoriaId) {
      where.id_categoria_fk = Number(categoriaId);
    }

    const pageNum = Number(page);
    const limitNum = Number(limit);
    const skip = (pageNum - 1) * limitNum;

    const [data, total] = await this.prisma.$transaction([
      this.prisma.gasto.findMany({
        where,
        include: { categoria: true },
        orderBy: { fecha: 'desc' },
        skip,
        take: limitNum,
      }),
      this.prisma.gasto.count({ where }),
    ]);

    return {
      data,
      meta: {
        total,
        page: pageNum,
        limit: limitNum,
        totalPages: Math.ceil(total / limitNum),
      },
    };
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

    if (updateGastoDto.categoria !== undefined) {
      const categoriaExiste = await this.prisma.categoria.findUnique({
        where: { id: updateGastoDto.categoria },
      });

      if (!categoriaExiste) {
        throw new NotFoundException(
          `La categoría con ID #${updateGastoDto.categoria} no existe`,
        );
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

  async getResumen(filterDto?: FilterResumenDto) {
    const ahora = new Date();
    const anio = filterDto?.anio ? Number(filterDto.anio) : ahora.getFullYear();
    const mes = filterDto?.mes ? Number(filterDto.mes) : undefined;

    let fechaInicio: Date;
    let fechaFin: Date;

    if (mes) {
      // Filtro por un mes específico
      fechaInicio = new Date(Date.UTC(anio, mes - 1, 1, 0, 0, 0, 0));
      fechaFin = new Date(Date.UTC(anio, mes, 0, 23, 59, 59, 999));
    } else {
      // Filtro por todo el año
      fechaInicio = new Date(Date.UTC(anio, 0, 1, 0, 0, 0, 0));
      fechaFin = new Date(Date.UTC(anio, 11, 31, 23, 59, 59, 999));
    }

    const where: Prisma.GastoWhereInput = {
      fecha: {
        gte: fechaInicio,
        lte: fechaFin,
      },
    };

    const agrupado = await this.prisma.gasto.groupBy({
      by: ['id_categoria_fk'],
      _sum: {
        valor: true,
      },
      where,
    });

    const idsCategorias = agrupado.map((item) => item.id_categoria_fk);
    const categorias = await this.prisma.categoria.findMany({
      where: { id: { in: idsCategorias } },
    });

    const mapaCategorias = new Map(categorias.map((c) => [c.id, c.nombre]));

    const totalGeneral = agrupado.reduce(
      (acum, item) => acum + Number(item._sum.valor || 0),
      0,
    );

    const porCategoria = agrupado.map((item) => {
      const total = Number(item._sum.valor || 0);
      const porcentaje =
        totalGeneral > 0
          ? Number(((total / totalGeneral) * 100).toFixed(2))
          : 0;

      return {
        categoriaId: item.id_categoria_fk,
        categoriaNombre:
          mapaCategorias.get(item.id_categoria_fk) || 'Sin categoría',
        total,
        porcentaje,
      };
    });

    return {
      periodo: {
        mes: mes ?? null,
        anio,
        fechaInicio,
        fechaFin,
      },
      totalGeneral,
      porCategoria,
    };
  }
}