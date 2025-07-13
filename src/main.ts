import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { Logger, ValidationPipe } from '@nestjs/common';
import { envs } from './config/envs';

// TODO: implementar pruebas automatizadas.
// TODO: Implementar docker
async function bootstrap() {
  const logger = new Logger('main bootstrap');
  const app = await NestFactory.create(AppModule);

  // Configuración de validaciones globales para los DTOs
  // Se usa ValidationPipe para validar los DTOs y transformar los datos entrantes
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  // Configuración del swagger para la documentación de la API
  const config = new DocumentBuilder()
    .setTitle('Find a restaurant - API')
    .setDescription('API documentation for the Find a Restaurant application')
    .setVersion('1.0')
    .addTag('users', 'Operaciones relacionadas con usuarios')
    .build();
  const documentFactory = () => SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, documentFactory);

  await app.listen(envs.apiPort);
  logger.log(`Application is running on port: ${envs.apiPort}`);
  logger.log(`Swagger is available at: /api`);
}
bootstrap();
