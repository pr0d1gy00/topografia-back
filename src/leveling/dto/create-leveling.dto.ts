import { IsString, IsNumber, IsOptional, IsNotEmpty } from 'class-validator';

// Para crear la "Libreta" (Header)
export class CreateLevelingRunDto {
    @IsNumber()
    projectId: number;

    @IsString()
    @IsNotEmpty()
    name: string; // Ej: "Circuito BM-1 a BM-2"

    @IsNumber()
    @IsOptional()
    instrumentId?: number;
}

// Para crear una "Lectura" (Fila)
export class CreateLevelingReadingDto {
    @IsNumber()
    runId: number;

    @IsNumber()
    @IsOptional()
    pointId?: number; // Si la lectura es sobre un punto conocido (BM) o uno que queremos guardar

    // La lógica clásica: Vista Atrás (+) o Vista Adelante (-)
    @IsNumber()
    @IsOptional()
    backsight?: number;   // Vista Atrás (+)

    @IsNumber()
    @IsOptional()
    intermediate?: number; // Vista Intermedia (Solo para detalles, no cambia el aparato)

    @IsNumber()
    @IsOptional()
    foresight?: number;    // Vista Adelante (-)

    // Opcional: Si queremos forzar un orden específico, si no, lo calculamos
    @IsNumber()
    @IsOptional()
    order?: number;
}