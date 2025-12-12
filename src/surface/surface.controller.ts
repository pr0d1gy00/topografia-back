import { Controller, Post, Body, Get, Param, Patch, ParseIntPipe } from '@nestjs/common';
import { SurfacesService } from './surface.service';
import { CreateSurfaceDto, AddPointsToSurfaceDto, UpdateSurfaceResultDto } from './dto/create-surface.dto';

@Controller('surfaces')
export class SurfacesController {
  constructor(private readonly surfacesService: SurfacesService) {}

  @Post()
  create(@Body() dto: CreateSurfaceDto) {
    return this.surfacesService.create(dto);
  }

  @Post(':id/points')
  addPoints(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: AddPointsToSurfaceDto,
  ) {
    return this.surfacesService.addPoints(id, dto);
  }

  @Get(':id/full') // Endpoint pesado: trae todos los puntos para calcular
  findOneWithPoints(@Param('id', ParseIntPipe) id: number) {
    return this.surfacesService.findOneWithPoints(id);
  }

  @Get('project/:projectId')
  findAllByProject(@Param('projectId', ParseIntPipe) projectId: number) {
    return this.surfacesService.findAllByProject(projectId);
  }
  
  @Patch(':id/results')
  updateResult(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateSurfaceResultDto
  ) {
    return this.surfacesService.updateResult(id, dto);
  }
}