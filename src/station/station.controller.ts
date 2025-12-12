import { Controller, Post, Body, Get, Param, ParseIntPipe } from '@nestjs/common';
import { StationsService } from './station.service';
import { CreateStationDto } from './dto/create-station.dto';

@Controller('stations')
export class StationsController {
  constructor(private readonly stationsService: StationsService) {}

  @Post()
  create(@Body() createStationDto: CreateStationDto) {
    return this.stationsService.create(createStationDto);
  }

  @Get('project/:id')
  findByProject(@Param('id', ParseIntPipe) projectId: number) {
    return this.stationsService.findByProject(projectId);
  }
}