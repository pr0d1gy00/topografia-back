import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateLevelingRunDto, CreateLevelingReadingDto } from './dto/create-leveling.dto';

@Injectable()
export class LevelingService {
  constructor(private prisma: PrismaService) {}

  // 1. Crear la Libreta
  async createRun(dto: CreateLevelingRunDto) {
    return this.prisma.levelingRun.create({
      data: {
        projectId: dto.projectId,
        name: dto.name,
        instrumentId: dto.instrumentId,
      },
    });
  }

  // 2. Crear una Lectura y CALCULAR Z automáticamente
  async addReading(dto: CreateLevelingReadingDto) {
    // A. Obtener la libreta y las lecturas anteriores para saber el contexto
    const run = await this.prisma.levelingRun.findUnique({
      where: { id: dto.runId },
      include: { readings: { orderBy: { order: 'desc' }, take: 1 } }, // Traer la última lectura
    });

    if (!run) throw new NotFoundException('Libreta de nivelación no encontrada');

    // Determinar el orden (secuencia)
    const nextOrder = (run.readings[0]?.order || 0) + 1;

    // VARIABLES DE CÁLCULO
    let currentZ = 0;   // La cota del punto donde está la mira
    let currentAI = 0;  // Altura del Instrumento

    // CASO 1: PRIMERA LECTURA (PUNTO DE ARRANQUE / BM)
    // Se requiere un punto conocido con Z y una Vista Atrás.
    if (nextOrder === 1) {
      if (!dto.pointId || dto.backsight === undefined) {
        throw new BadRequestException('La primera lectura debe tener un Punto (BM) y Vista Atrás');
      }
      
      const startPoint = await this.prisma.point.findUnique({ where: { id: dto.pointId } });
      if (!startPoint) throw new NotFoundException('Punto de inicio no encontrado');

      currentZ = startPoint.z; // La cota es la del punto base
      currentAI = currentZ + dto.backsight; // AI = Cota + Vista Atrás
    } 
    // CASO 2: LECTURAS SIGUIENTES
    else {
      const lastReading = run.readings[0];
      
      // Recuperamos la Altura Instrumento (AI) anterior
      // Si la anterior fue Vista Adelante (cambio), la AI cambia en el siguiente paso, 
      // pero para calcular ESTE punto, usamos la AI vigente.
      currentAI = lastReading.calculatedAI!; 

      // Si es Vista Intermedia o Adelante, calculamos la cota
      const readingValue = dto.foresight ?? dto.intermediate;
      
      if (readingValue !== undefined) {
         currentZ = currentAI - readingValue; // Cota = AI - Lectura
      }

      // SI HAY CAMBIO (Vista Adelante + Vista Atrás en el mismo punto técnico)
      // Ojo: En BDD relacional, un "Punto de Cambio" (PC) suele representarse 
      // como el cierre de una línea y el inicio de otra, o una misma fila con ambos datos.
      // Para simplificar, asumimos que si envías 'backsight' en una lectura que no es la primera,
      // estás actualizando la AI para lo que sigue.
      if (dto.backsight) {
        currentAI = currentZ + dto.backsight;
      }
    }

    // Guardar en BD
    const reading = await this.prisma.levelingReading.create({
      data: {
        runId: dto.runId,
        pointId: dto.pointId,
        backsight: dto.backsight,
        intermediate: dto.intermediate,
        foresight: dto.foresight,
        calculatedZ: currentZ,
        calculatedAI: currentAI,
        order: nextOrder,
      },
    });

    // Si la lectura tiene un punto asociado (pointId), ¿actualizamos su Z en la tabla Points?
    // Depende de la lógica de tu padre. Generalmente sí, si no es un punto fijo.
    if (dto.pointId && currentZ !== 0) {
       // Opcional: Actualizar el punto maestro
       // await this.prisma.point.update(...) 
    }

    return reading;
  }

  // Obtener una libreta completa
  async findRun(id: number) {
    return this.prisma.levelingRun.findUnique({
      where: { id },
      include: { 
        readings: { 
          orderBy: { order: 'asc' },
          include: { point: true } // Incluir nombres de puntos
        } 
      },
    });
  }
}