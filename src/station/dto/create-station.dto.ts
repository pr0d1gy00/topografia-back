import { IsNumber, IsOptional, ValidateIf } from 'class-validator';

export class CreateStationDto {
    @IsNumber()
    projectId: number;

    @IsNumber()
    instrumentId: number;

    @IsNumber()
    occupiedPointId: number; // ID del punto donde puso el trípode

    @IsNumber()
    heightInstrument: number; // Altura medida con flexómetro (HI)

    // --- Lógica de Orientación (O uno o el otro) ---

    @IsOptional()
    @IsNumber()
    backsightPointId?: number; // Opción A: Mirar a un punto conocido

    @ValidateIf(o => !o.backsightPointId) // Si no hay punto, exige ángulo
    @IsNumber()
    backsightAngle?: number;   // Opción B: "Acimut de partida" manual
}