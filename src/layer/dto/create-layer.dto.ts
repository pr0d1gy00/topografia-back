import { IsString, IsNumber, IsBoolean, IsOptional, IsNotEmpty, IsObject } from 'class-validator';

export class CreateLayerDto {
  @IsNumber()
  projectId: number;

  @IsString()
  @IsNotEmpty()
  name: string; // Ej: "Vía Principal", "Linderos", "Casas"

  @IsString()
  @IsNotEmpty()
  color: string; // Ej: "#FF5733" (Hexadecimal)

  @IsBoolean()
  @IsOptional()
  visible?: boolean;
}

export class UpdateLayerDto {
  @IsString()
  @IsOptional()
  name?: string;

  @IsString()
  @IsOptional()
  color?: string;

  @IsBoolean()
  @IsOptional()
  visible?: boolean;

  // AQUÍ ESTÁ LA CLAVE:
  // Recibimos un objeto JSON completo (GeoJSON FeatureCollection)
  // No lo validamos estrictamente porque puede ser muy complejo.
  @IsOptional()
  drawingData?: any; 
}