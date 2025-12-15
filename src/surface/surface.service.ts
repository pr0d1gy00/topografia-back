// src/surface/surface.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateSurfaceDto, AddPointsToSurfaceDto, UpdateSurfaceResultDto } from './dto/create-surface.dto';
import { point as Point } from '@prisma/client'; // Importar tipo Point

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

  // 2. Agregar Puntos a la Superficie
  async addPoints(surfaceId: number, dto: AddPointsToSurfaceDto) {
    const surface = await this.prisma.surface.findUnique({ where: { id: surfaceId } });
    if (!surface) throw new NotFoundException('Superficie no encontrada');

    const data = dto.pointIds.map((pointId) => ({
      surfaceId: surfaceId,
      pointId: pointId,
    }));

    return this.prisma.pointsOnSurfaces.createMany({
      data,
      skipDuplicates: true, 
    });
  }

  // 3. Obtener Superficie con Puntos
  async findOneWithPoints(id: number) {
    const surface = await this.prisma.surface.findUnique({
      where: { id },
      include: {
        points: { include: { point: true } },
      },
    });
    if (!surface) throw new NotFoundException('Superficie no encontrada');
    return surface;
  }

  // 4. Guardar resultados
  async updateResult(id: number, dto: UpdateSurfaceResultDto) {
    return this.prisma.surface.update({
      where: { id },
      data: { contourGeometry: dto.contourGeometry ?? undefined },
    });
  }

  async findAllByProject(projectId: number) {
    return this.prisma.surface.findMany({ where: { projectId } });
  }

  // --- LÓGICA DE CÁLCULO DE VOLUMEN (NUEVA) ---

  async calculateVolume(initialSurfaceId: number, finalSurfaceId: number, gridSize: number = 1.0) {
    // A. Obtener puntos de ambas superficies
    const s1 = await this.findOneWithPoints(initialSurfaceId);
    const s2 = await this.findOneWithPoints(finalSurfaceId);

    // Mapear a objetos Point simples
    const points1 = s1.points.map(p => p.point);
    const points2 = s2.points.map(p => p.point);

    if (points1.length < 3 || points2.length < 3) {
      throw new Error("Se necesitan al menos 3 puntos por superficie para calcular.");
    }

    // B. Definir el área común (Bounding Box de todos los puntos)
    const allPoints = [...points1, ...points2];
    const minX = Math.min(...allPoints.map(p => p.x));
    const maxX = Math.max(...allPoints.map(p => p.x));
    const minY = Math.min(...allPoints.map(p => p.y));
    const maxY = Math.max(...allPoints.map(p => p.y));

    let cutVolume = 0;  // Corte (-)
    let fillVolume = 0; // Relleno (+)
    let area = 0;

    // C. Grid Method
    for (let x = minX; x <= maxX; x += gridSize) {
      for (let y = minY; y <= maxY; y += gridSize) {
        
        const z1 = this.interpolateZ(x, y, points1);
        const z2 = this.interpolateZ(x, y, points2);

        // Si hay elevación válida en ambas superficies en este punto
        if (z1 !== null && z2 !== null) {
          const diff = z2 - z1; // Final - Inicial
          const volumeCell = Math.abs(diff) * (gridSize * gridSize);

          if (diff < 0) {
            cutVolume += volumeCell; // Terreno bajó (Corte)
          } else {
            fillVolume += volumeCell; // Terreno subió (Relleno)
          }
          area += (gridSize * gridSize);
        }
      }
    }

    return {
      initialSurface: s1.name,
      finalSurface: s2.name,
      cut: cutVolume,
      fill: fillVolume,
      net: fillVolume - cutVolume,
      areaCovered: area
    };
  }

  // Interpolación IDW (Inverse Distance Weighting)
  private interpolateZ(x: number, y: number, points: Point[]): number | null {
    let numerator = 0;
    let denominator = 0;
    const power = 2;
    const searchRadius = 50; // Buscar puntos a 50m a la redonda

    let foundPoints = false;

    for (const p of points) {
      const dist = Math.sqrt(Math.pow(p.x - x, 2) + Math.pow(p.y - y, 2));
      
      if (dist < 0.001) return p.z; // Coincidencia exacta

      if (dist <= searchRadius) {
        const weight = 1 / Math.pow(dist, power);
        numerator += weight * p.z;
        denominator += weight;
        foundPoints = true;
      }
    }

    if (!foundPoints || denominator === 0) return null;
    return numerator / denominator;
  }
}