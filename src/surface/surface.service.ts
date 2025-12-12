import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateSurfaceDto, AddPointsToSurfaceDto, UpdateSurfaceResultDto } from './dto/create-surface.dto';

@Injectable()
export class SurfacesService {
  constructor(private prisma: PrismaService) {}

  // 1. Crear Superficie
  async create(dto: CreateSurfaceDto) {
    return this.prisma.surface.create({
      data: {
        projectId: dto.projectId,
        name: dto.name,
        type: dto.type,
        contourIntervalMajor: dto.contourIntervalMajor ?? 5.0,
        contourIntervalMinor: dto.contourIntervalMinor ?? 1.0,
      },
    });
  }

  // 2. Agregar Puntos a la Superficie (Relación Many-to-Many)
  async addPoints(surfaceId: number, dto: AddPointsToSurfaceDto) {
    // Verificamos que la superficie exista
    const surface = await this.prisma.surface.findUnique({ where: { id: surfaceId } });
    if (!surface) throw new NotFoundException('Superficie no encontrada');

    // Usamos createMany para eficiencia (si tu DB lo soporta, Postgres sí)
    // OJO: Prisma createMany no ignora duplicados por defecto fácilmente en M:N pura,
    // así que hacemos un loop o una transacción. La forma segura en Prisma:
    
    // Opción limpia: Usar "connect" en update, pero para muchos puntos puede ser pesado.
    // Vamos a insertar ignorando los que ya estén.
    
    const data = dto.pointIds.map((pointId) => ({
      surfaceId: surfaceId,
      pointId: pointId,
    }));

    // createMany con skipDuplicates es la clave aquí
    return this.prisma.pointsOnSurfaces.createMany({
      data,
      skipDuplicates: true, 
    });
  }

  // 3. Obtener Superficie con sus Puntos (Para que el Frontend calcule el TIN)
  async findOneWithPoints(id: number) {
    const surface = await this.prisma.surface.findUnique({
      where: { id },
      include: {
        points: {
          include: {
            point: true, // Traer las coordenadas X,Y,Z del punto
          },
        },
      },
    });
    if (!surface) throw new NotFoundException('Superficie no encontrada');

    // Aplanamos la respuesta para que al frontend le llegue algo limpio
    // En vez de tener { surface, points: [{ point: {x,y,z} }] }
    // Podrías mapearlo, pero devolvamos el objeto completo por ahora.
    return surface;
  }

  // 4. Guardar resultados calculados (Caché de Curvas de Nivel)
  async updateResult(id: number, dto: UpdateSurfaceResultDto) {
    return this.prisma.surface.update({
      where: { id },
      data: {
        contourGeometry: dto.contourGeometry ?? undefined,
      },
    });
  }

  // Listar superficies de un proyecto
  async findAllByProject(projectId: number) {
    return this.prisma.surface.findMany({
      where: { projectId },
    });
  }
}