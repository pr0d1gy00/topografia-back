import { Controller, Post, Body, Get, Param, ParseIntPipe } from '@nestjs/common';
import { ObservationsService } from './observation.service';
import { CreateObservationDto } from './dto/create-observation.dto';

@Controller('observations')
export class ObservationsController {
  constructor(private readonly observationsService: ObservationsService) {}

  @Post()
  create(@Body() createObservationDto: CreateObservationDto) {
    return this.observationsService.create(createObservationDto);
  }

  @Get('project/:id')
  findAllByProject(@Param('id', ParseIntPipe) projectId: number) {
    return this.observationsService.findAllByProject(projectId);
  }
}