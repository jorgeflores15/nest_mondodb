import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import * as express from 'express';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: ['log', 'error', 'warn', 'fatal'],
  });
  app.use(express.json({ limit: '10mb' }));
  const options = new DocumentBuilder()
    .setTitle('MongoDB Store REST API')
    .setDescription('API REST con MongoDB')
    .setVersion('1.0')
    .build();
  const document = SwaggerModule.createDocument(app, options);

  app.enableCors({
    origin: 'http://localhost'
  });

  SwaggerModule.setup('docs', app, document);
  await app.listen(3000);
}
bootstrap();
