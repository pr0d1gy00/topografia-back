import { Module } from '@nestjs/common';
import { StationsService } from './station.service';
import { StationsController } from './station.controller';
import { PrismaService } from 'src/prisma/prisma.service';
@Module({
  controllers: [StationsController],
  providers: [StationsService, PrismaService],
})
export class StationModule {}
