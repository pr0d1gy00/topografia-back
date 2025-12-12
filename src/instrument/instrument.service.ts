import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateInstrumentDto } from './dto/create-instrument.dto';
import { UpdateInstrumentDto } from './dto/update-instrument.dto';
@Injectable()
export class InstrumentsService {
  constructor(private prisma: PrismaService) {}

  async create(dto: CreateInstrumentDto) {
    return this.prisma.instrument.create({
      data: {
        name: dto.name,
        type: dto.type, // Asegúrate que coincida con el Enum de Prisma
        serial: dto.serial,
        stadiaConstant: dto.stadiaConstant ?? 100, // Valor por defecto estándar
        stadiaAddition: dto.stadiaAddition ?? 0,
        userId: dto.userId,
      },
    });
  }

  // Obtener todos los instrumentos de un usuario
  // (Para llenar el combobox "Seleccionar Equipo" en el Frontend)
  async findAllByUser(userId: number) {
    return this.prisma.instrument.findMany({
      where: { userId },
      orderBy: { name: 'asc' }
    });
  }

  async findOne(id: number) {
    const instrument = await this.prisma.instrument.findUnique({ where: { id } });
    if (!instrument) throw new NotFoundException(`Instrumento #${id} no encontrado`);
    return instrument;
  }

  async update(id: number, dto: UpdateInstrumentDto) {
    await this.findOne(id); // Verificar existencia
    return this.prisma.instrument.update({
      where: { id },
      data: dto,
    });
  }

  async remove(id: number) {
    // Aquí podrías validar si ya se usó en alguna estación para no romper integridad
    // Prisma lanzará error si hay FK constraint, lo cual está bien.
    return this.prisma.instrument.delete({ where: { id } });
  }
}