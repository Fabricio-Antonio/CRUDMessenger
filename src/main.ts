import { NestFactory } from '@nestjs/core';
import { AppModule } from './app/app.module';
import { ConfigService } from '@nestjs/config';
import { ValidationPipe, Logger } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';

async function bootstrap() {
  const logger = new Logger('Bootstrap');
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  const configService = app.get(ConfigService);
  
  const nodeEnv = configService.get<string>('NODE_ENV', 'development');
  const isDocker = configService.get<string>('DOCKER_ENV') === 'true';
  const port = configService.get<number>('PORT', 3000);
  
  logger.log(`Starting application in ${nodeEnv} mode`);
  logger.log(`Docker environment: ${isDocker ? 'yes' : 'no'}`);
  
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: true,
    }),
  );


  app.useStaticAssets(join(__dirname, '..', 'public'), {
    prefix: '/public/',
  });

  if (nodeEnv !== 'production') {
    const config = new DocumentBuilder()
      .setTitle('CRUD Messenger API')
      .setDescription('The CRUD Messenger API description')
    .setVersion('1.0')
    .addBearerAuth()
    .build();
    const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs', app, document);
    logger.log('Swagger documentation available at /docs');
  }

  await app.listen(port);
  
  const host = isDocker ? '0.0.0.0' : 'localhost';
  logger.log(`Application is running on: http://${host}:${port}`);
  logger.log(`Environment: ${nodeEnv}`);
  logger.log(`Database host: ${configService.get('DB_CONFIG.host')}`);
  logger.log(`Database name: ${configService.get('DB_CONFIG.database')}`);
}

bootstrap().catch((error) => {
  console.error('Error starting application:', error);
  process.exit(1);
});
