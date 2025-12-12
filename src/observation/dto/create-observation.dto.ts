// src/topography/dto/create-observation.dto.ts
import { IsNumber, IsOptional, IsBoolean, IsString, ValidateIf } from 'class-validator';

export class CreateObservationDto {
    @IsNumber()
    stationId: number;

    @IsNumber()
    angleHorizontal: number; // Azimut

    @IsNumber()
    @IsOptional()
    angleVertical?: number; // Cenital

    @IsNumber()
    heightTarget: number; // Altura prisma o hilo medio

    // --- Lógica Condicional para Teodolito ---
    @IsBoolean()
    @IsOptional()
    isStadia?: boolean;

    @ValidateIf(o => o.isStadia === true)
    @IsNumber()
    stadiaTop?: number;

    @ValidateIf(o => o.isStadia === true)
    @IsNumber()
    stadiaBottom?: number;

    // --- Lógica Condicional para Estación Total ---
    @ValidateIf(o => o.isStadia === false || !o.isStadia)
    @IsNumber()
    @IsOptional()
    distanceSlope?: number;

    @IsString()
    @IsOptional()
    description?: string;

    @IsBoolean()
    @IsOptional()
    calculateCoordinates?: boolean; // Flag para decir "Calcula el punto YA"
}