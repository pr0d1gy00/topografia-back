import { Module, Global } from '@nestjs/common';
import { PrismaService } from '../prisma.service';

@Global() // Opcional: si quieres que PrismaService esté disponible en todos los módulos sin importar explícitamente.
@Module({
  providers: [PrismaService],
  exports: [PrismaService], // Esto lo hace accesible a otros módulos que lo importen.
})
export class PrismaModule {}