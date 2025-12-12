import { Module } from '@nestjs/common';
import { SurfacesService } from './surface.service';
import { SurfacesController } from './surface.controller';
import { PrismaService } from 'src/prisma/prisma.service';
@Module({
  controllers: [SurfacesController],
  providers: [SurfacesService, PrismaService],
})
export class SurfaceModule {}
