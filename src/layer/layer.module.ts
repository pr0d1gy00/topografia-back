import { Module } from '@nestjs/common';
import { LayersService } from './layer.service';
import { LayersController } from './layer.controller';
import { PrismaService } from 'src/prisma/prisma.service';
@Module({
  controllers: [LayersController],
  providers: [LayersService, PrismaService],
})
export class LayerModule {}
