import { Module } from '@nestjs/common';
import { PointsService } from './point.service';
import { PointsController } from './point.controller';
import { PrismaService } from 'src/prisma/prisma.service';
@Module({
  controllers: [PointsController],
  providers: [PointsService, PrismaService],
})
export class PointModule {}
