import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateLayerDto, UpdateLayerDto } from './dto/create-layer.dto';

@Injectable()
export class LayersService {
  constructor(private prisma: PrismaService) {}

  // 1. Crear nueva capa
  async create(dto: CreateLayerDto) {
    return this.prisma.layer.create({
      data: {
        projectId: dto.projectId,
        name: dto.name,
        color: dto.color,
        visible: dto.visible ?? true, // Por defecto visible
        drawingData: { type: "FeatureCollection", features: [] }, // Inicializar vacío válido GeoJSON
      },
    });
  }

  // 2. Obtener todas las capas de un proyecto (Para cargar el mapa)
  async findAllByProject(projectId: number) {
    return this.prisma.layer.findMany({
      where: { projectId },
      orderBy: { id: 'asc' }, // Mantener el orden de creación en la lista
    });
  }

  // 3. Actualizar capa (Cambiar color, nombre o GUARDAR DIBUJO)
  async update(id: number, dto: UpdateLayerDto) {
    // Verificamos existencia
    const layer = await this.prisma.layer.findUnique({ where: { id } });
    if (!layer) throw new NotFoundException('Capa no encontrada');

    return this.prisma.layer.update({
      where: { id },
      data: {
        name: dto.name,
        color: dto.color,
        visible: dto.visible,
        drawingData: dto.drawingData ?? undefined, // Solo actualiza si envían datos
      },
    });
  }

  // 4. Eliminar capa
  async remove(id: number) {
    return this.prisma.layer.delete({ where: { id } });
  }
}