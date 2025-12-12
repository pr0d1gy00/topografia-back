import { IsString, IsNumber, IsEnum, IsNotEmpty, IsArray, IsOptional } from 'class-validator';

export enum SurfaceType {
  INITIAL = 'INITIAL', // Terreno Original
  FINAL = 'FINAL',     // Terreno Modificado (Para comparar)
}

// 1. Para crear la "Carpeta" de la superficie
export class CreateSurfaceDto {
  @IsNumber()
  projectId: number;

  @IsString()
  @IsNotEmpty()
  name: string; // Ej: "Levantamiento Base", "Plataforma Nivel 1"

  @IsEnum(SurfaceType)
  type: SurfaceType;
  
  // Configuración opcional para curvas de nivel
  @IsNumber()
  @IsOptional()
  contourIntervalMajor?: number; // Ej: 5.0m

  @IsNumber()
  @IsOptional()
  contourIntervalMinor?: number; // Ej: 1.0m
}

// 2. Para meter puntos a la superficie masivamente
export class AddPointsToSurfaceDto {
  @IsArray()
  @IsNumber({}, { each: true }) // Valida que sea un array de números
  pointIds: number[];
}

// 3. Para guardar el cálculo (Geometría/Volumen) desde el Frontend o Worker
export class UpdateSurfaceResultDto {
  @IsOptional()
  contourGeometry?: any; // JSON con las líneas (GeoJSON)
  
  // Podríamos guardar el volumen calculado si es una superficie de diferencia, 
  // pero generalmente el volumen es el resultado de comparar DOS superficies.
}