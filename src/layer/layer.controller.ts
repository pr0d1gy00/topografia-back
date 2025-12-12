import { Controller, Post, Get, Patch, Delete, Body, Param, ParseIntPipe } from '@nestjs/common';
import { LayersService } from './layer.service';
import { CreateLayerDto, UpdateLayerDto } from './dto/create-layer.dto';

@Controller('layers')
export class LayersController {
  constructor(private readonly layersService: LayersService) {}

  @Post()
  create(@Body() dto: CreateLayerDto) {
    return this.layersService.create(dto);
  }

  @Get('project/:projectId')
  findAllByProject(@Param('projectId', ParseIntPipe) projectId: number) {
    return this.layersService.findAllByProject(projectId);
  }

  @Patch(':id')
  update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateLayerDto) {
    return this.layersService.update(id, dto);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.layersService.remove(id);
  }
}