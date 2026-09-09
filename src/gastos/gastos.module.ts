import { Module } from '@nestjs/common';
import { GastosService } from './gastos.service.js';
import { GastosController } from './gastos.controller.js';

@Module({
  controllers: [GastosController],
  providers: [GastosService],
})
export class GastosModule {}
