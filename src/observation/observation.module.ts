import { Module } from '@nestjs/common';
import { ObservationsService } from './observation.service';
import { ObservationsController } from './observation.controller';
import { PrismaService } from 'src/prisma/prisma.service';
@Module({
  controllers: [ObservationsController],
  providers: [ObservationsService, PrismaService],
})
export class ObservationModule {}
