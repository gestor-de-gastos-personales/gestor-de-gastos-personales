import { Module } from '@nestjs/common';
import { AppController } from './app.controller.js';
import { AppService } from './app.service.js';
import { GastosModule } from './gastos/gastos.module.js';

@Module({
  imports: [GastosModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
