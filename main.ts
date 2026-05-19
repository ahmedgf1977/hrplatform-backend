import 'reflect-metadata';
import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // CORS — permite conexión desde el frontend en Vercel
  app.enableCors({
    origin: [
      'http://localhost:5173',
      'https://hrplatform-zavix-almdc.vercel.app',
      /\.vercel\.app$/,
    ],
    credentials: true,
  });

  // Validación automática de DTOs
  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));

  // Prefijo global /api
  app.setGlobalPrefix('api');

  const port = process.env.PORT || 3000;
  await app.listen(port);
  console.log(`🚀 HRPlatform API corriendo en puerto ${port}`);
}
bootstrap();
