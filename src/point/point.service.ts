import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import {  UpdatePointDto } from './dto/update-point.dto';
import { CreatePointDto } from './dto/create-point.dto';
import { Prisma } from '@prisma/client';

@Injectable()
export class PointsService {
  constructor(private prisma: PrismaService) {}

  async create(dto: CreatePointDto) {
    try {
      return await this.prisma.point.create({
        data: {
          projectId: dto.projectId,
          name: dto.name,
          x: dto.x,
          y: dto.y,
          z: dto.z,
          code: dto.code?.toUpperCase(),
          isFixed: dto.isFixed || false,
        },
      });
    } catch (error) {
      throw new BadRequestException('No se pudo crear el punto.');
    }
  }

  async findAllByProject(projectId: number) {
    return this.prisma.point.findMany({
      where: { projectId },
      orderBy: { id: 'desc' }, // <--- ESTO ES OBLIGATORIO para ver lo último arriba
    });
  }

  async findOne(id: number) {
    const point = await this.prisma.point.findUnique({ where: { id } });
    if (!point) throw new NotFoundException(`Punto #${id} no encontrado`);
    return point;
  }

  async update(id: number, dto: UpdatePointDto) {
    await this.findOne(id);

    return this.prisma.point.update({
      where: { id },
      data: {
        ...dto,
        code: dto.code?.toUpperCase(),
      },
    });
  }

  async remove(id: number) {
    try {
      return await this.prisma.point.delete({ where: { id } });
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2003') {
        throw new BadRequestException(
          'No se puede borrar este punto porque está siendo usado en una Estación, Observación o Nivelación.',
        );
      }
      throw error;
    }
  }
}