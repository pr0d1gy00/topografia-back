import { IsString, IsNumber, IsOptional, IsEnum, IsNotEmpty } from 'class-validator';

// Definimos el Enum aquí o impórtalo de Prisma si generaste los tipos
export enum InstrumentType {
  THEODOLITE = 'THEODOLITE',
  LEVEL = 'LEVEL',
  TOTAL_STATION = 'TOTAL_STATION',
  GPS = 'GPS',
}

export class CreateInstrumentDto {
  @IsString()
  @IsNotEmpty()
  name: string; // Ej: "Wild T2", "Leica NA2"

  @IsEnum(InstrumentType)
  type: InstrumentType;

  @IsString()
  @IsOptional()
  serial?: string;

  // CONSTANTES ESTADIMÉTRICAS (Vital para Teodolito)
  @IsNumber()
  @IsOptional()
  stadiaConstant?: number; // K (Default será 100 en el servicio si no envían nada)

  @IsNumber()
  @IsOptional()
  stadiaAddition?: number; // C (Default será 0)

  // Relación con el usuario (o se puede sacar del Request si usas Auth)
  @IsNumber()
  userId: number; 
}
