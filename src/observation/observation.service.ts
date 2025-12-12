import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateObservationDto } from './dto/create-observation.dto';

@Injectable()
export class ObservationsService {
  constructor(private prisma: PrismaService) {}

  async create(dto: CreateObservationDto) {
    // 1. Obtener datos de la Estación (dónde está parado)
    const station = await this.prisma.station.findUnique({
      where: { id: dto.stationId },
      include: { occupiedPoint: true, instrument: true },
    });

    if (!station) throw new NotFoundException('Estación no encontrada');

    // 2. Calcular Distancia Horizontal y Vertical
    let horizDist = 0;
    let vertDist = 0; // Desnivel

    // Convertir grados a radianes (JS usa radianes)
    const radH = (dto.angleHorizontal * Math.PI) / 180;
    const radV = dto.angleVertical ? (dto.angleVertical * Math.PI) / 180 : Math.PI / 2;

    if (dto.isStadia) {
      // --- MODO TEODOLITO ---
      // D = K * (Sup - Inf) * (sin(V))^2  (Fórmula estadimétrica estándar para distancia horizontal)
      // Ojo: Depende si el ángulo es Cenital (0 arriba) o Vertical (0 horizonte). 
      // Asumimos Cenital para Topografía moderna.
      const k = station.instrument.stadiaConstant || 100;
      const intercept = dto.stadiaTop! - dto.stadiaBottom!;
      
      // Distancia Inclinada aproximada
      const slopeDist = k * intercept; 
      
      // Reducción a horizontal (simplificada)
      horizDist = slopeDist * Math.pow(Math.sin(radV), 2);
      
      // Cálculo de desnivel (D * sin(2V) / 2) o trigonometría básica
      vertDist = slopeDist * Math.sin(radV) * Math.cos(radV); // Ojo: Revisar fórmula exacta según tu libro de referencia
    } else {
      // --- MODO ESTACIÓN TOTAL ---
      if (!dto.distanceSlope) throw new Error('Falta distancia inclinada');
      
      horizDist = dto.distanceSlope * Math.sin(radV);
      vertDist = dto.distanceSlope * Math.cos(radV); // Componente Z
    }

    // 3. Crear la Observación en BD
    const observation = await this.prisma.observation.create({
      data: {
        stationId: dto.stationId,
        angleHorizontal: dto.angleHorizontal,
        angleVertical: dto.angleVertical,
        heightTarget: dto.heightTarget,
        isStadia: dto.isStadia || false,
        stadiaTop: dto.stadiaTop,
        stadiaBottom: dto.stadiaBottom,
        distanceSlope: dto.distanceSlope,
        description: dto.description,
      },
    });

    // 4. ¿Debemos crear/calcular el Punto automáticamente? (Radiación)
    if (dto.calculateCoordinates) {
      const newX = station.occupiedPoint.x + (horizDist * Math.sin(radH));
      const newY = station.occupiedPoint.y + (horizDist * Math.cos(radH));
      
      // Z = Z_est + HI + Desnivel - HR
      // Nota: Corrección por curvatura y refracción se omite para distancias cortas (<500m)
      const newZ = station.occupiedPoint.z + station.heightInstrument + vertDist - dto.heightTarget;

      const newPoint = await this.prisma.point.create({
        data: {
          projectId: station.projectId,
          name: `P-${observation.id}`, // Nombre automático, luego se puede editar
          x: newX,
          y: newY,
          z: newZ,
          code: dto.description,
          // Relacionar punto con la observación
          observations: { connect: { id: observation.id } } 
        }
      });
      
      // Actualizar observación con el ID del punto creado
      await this.prisma.observation.update({
        where: { id: observation.id },
        data: { targetPointId: newPoint.id }
      });

      return { observation, point: newPoint };
    }

    return observation;
  }

  // Obtener observaciones por Proyecto
  async findAllByProject(projectId: number) {
    return this.prisma.observation.findMany({
      where: { station: { projectId: +projectId } },
      include: { targetPoint: true, station: true }
    });
  }
}