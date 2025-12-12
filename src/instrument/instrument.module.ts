import { Module } from '@nestjs/common';
import { InstrumentsService } from './instrument.service';
import { InstrumentsController } from './instrument.controller';
import { PrismaService } from 'src/prisma/prisma.service';
@Module({
  controllers: [InstrumentsController],
  providers: [InstrumentsService, PrismaService],
})
export class InstrumentModule {}
