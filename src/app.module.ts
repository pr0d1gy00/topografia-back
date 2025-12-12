import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaService } from '../prisma.service';
import { ObservationModule } from './observation/observation.module';
import { ObservationsController } from './observation/observation.controller';
import { ObservationsService } from './observation/observation.service';
import { StationModule } from './station/station.module';
import { PointModule } from './point/point.module';
import { LayerModule } from './layer/layer.module';
import { SurfaceModule } from './surface/surface.module';
import { InstrumentModule } from './instrument/instrument.module';
import { LevelingModule } from './leveling/leveling.module';
import { ProjectModule } from './project/project.module';

@Module({
  controllers: [AppController,],
  providers: [AppService,PrismaService ],
  imports: [ObservationModule, StationModule, PointModule, LevelingModule, InstrumentModule, SurfaceModule, LayerModule, ProjectModule],
})
export class AppModule {}
