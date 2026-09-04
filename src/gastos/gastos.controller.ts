import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { GastosService } from './gastos.service.js';
import { CreateGastoDto } from './dto/create-gasto.dto.js';
import { UpdateGastoDto } from './dto/update-gasto.dto.js';

@Controller('gastos')
export class GastosController {
  constructor(private readonly gastosService: GastosService) {}

  @Post()
  create(@Body() createGastoDto: CreateGastoDto) {
    return this.gastosService.create(createGastoDto);
  }

  @Get()
  findAll() {
    return this.gastosService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.gastosService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateGastoDto: UpdateGastoDto) {
    return this.gastosService.update(+id, updateGastoDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.gastosService.remove(+id);
  }
}
