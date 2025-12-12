import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateStationDto } from './dto/create-station.dto';

@Injectable()
export class StationsService {
  constructor(private prisma: PrismaService) {}

  async create(dto: CreateStationDto) {
    // 1. Validar que el punto ocupado existe
    const occupiedPoint = await this.prisma.point.findUnique({
      where: { id: dto.occupiedPointId },
    });
    if (!occupiedPoint) throw new NotFoundException('El punto de estación no existe.');

    // 2. Lógica de Orientación (Backsight)
    let finalBacksightAngle = dto.backsightAngle;

    if (dto.backsightPointId) {
      const backsightPoint = await this.prisma.point.findUnique({
        where: { id: dto.backsightPointId },
      });
      if (!backsightPoint) throw new NotFoundException('El punto visado (Backsight) no existe.');

      // CÁLCULO DE ACIMUT INVERSO (Geometría)
      // Calculamos el ángulo real entre donde está parado y el punto de atrás
      const deltaX = backsightPoint.x - occupiedPoint.x;
      const deltaY = backsightPoint.y - occupiedPoint.y;
      
      // Math.atan2 devuelve radianes entre -PI y PI
      let azimuthRad = Math.atan2(deltaX, deltaY);
      
      // Convertir a grados y normalizar a 0-360 (Norte geográfico)
      let azimuthDeg = azimuthRad * (180 / Math.PI);
      if (azimuthDeg < 0) azimuthDeg += 360;

      finalBacksightAngle = azimuthDeg;
    }

    // 3. Guardar la Estación
    return this.prisma.station.create({
      data: {
        projectId: dto.projectId,
        instrumentId: dto.instrumentId,
        occupiedPointId: dto.occupiedPointId,
        heightInstrument: dto.heightInstrument,
        backsightPointId: dto.backsightPointId,
        backsightAngle: finalBacksightAngle, // Guardamos el ángulo calculado o manual
      },
    });
  }

  async findByProject(projectId: number) {
    return this.prisma.station.findMany({
      where: { projectId },
      include: { 
        occupiedPoint: true, // Incluir coords para saber donde se paró
        instrument: true 
      },
      orderBy: { createdAt: 'desc' }
    });
  }
}