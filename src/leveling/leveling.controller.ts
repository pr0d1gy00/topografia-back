import { Controller, Post, Body, Get, Param, ParseIntPipe } from '@nestjs/common';
import { LevelingService } from './leveling.service';
import { CreateLevelingRunDto, CreateLevelingReadingDto } from './dto/create-leveling.dto';

@Controller('leveling')
export class LevelingController {
  constructor(private readonly levelingService: LevelingService) {}

  // 1. Crear una nueva libreta (Header)
  @Post('run')
  createRun(@Body() dto: CreateLevelingRunDto) {
    return this.levelingService.createRun(dto);
  }

  // 2. Agregar una lectura (Fila)
  @Post('reading')
  addReading(@Body() dto: CreateLevelingReadingDto) {
    return this.levelingService.addReading(dto);
  }

  // 3. Ver la libreta completa calculada
  @Get('run/:id')
  findRun(@Param('id', ParseIntPipe) id: number) {
    return this.levelingService.findRun(id);
  }
  // src/leveling/leveling.controller.ts
  @Get('project/:projectId')
  findAllByProject(@Param('projectId', ParseIntPipe) projectId: number) {
    // Necesitas implementar este método en leveling.service.ts también
    return this.levelingService.findAllByProject(projectId); 
  }
}