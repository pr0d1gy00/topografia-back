import { IsNumber, IsString, IsOptional, IsBoolean, IsNotEmpty } from 'class-validator';

export class CreatePointDto {
    @IsNumber()
    @IsNotEmpty()
    projectId: number;

    @IsString()
    @IsNotEmpty()
    name: string; // Ej: "E-1", "BM-5"

    @IsNumber()
    x: number; // Este

    @IsNumber()
    y: number; // Norte

    @IsNumber()
    z: number; // Cota / Elevación

    @IsString()
    @IsOptional()
    code?: string; // Ej: "ARBOL", "POSTE", "LINDERO"

    @IsBoolean()
    @IsOptional()
    isFixed?: boolean; // Si es TRUE, es un punto base que no se debe recalcular
}
