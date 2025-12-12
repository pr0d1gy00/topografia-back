import { Module } from '@nestjs/common';
import { LevelingService } from './leveling.service';
import { LevelingController } from './leveling.controller';
import { PrismaService } from 'src/prisma/prisma.service';
@Module({
  controllers: [LevelingController],
  providers: [LevelingService, PrismaService],
})
export class LevelingModule {}
