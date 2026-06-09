import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import * as cookieParser from 'cookie-parser';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.use(cookieParser());
  app.enableCors({
    origin: [
      process.env.WEB_ORIGIN ?? 'http://localhost:3000',
      process.env.ADMIN_ORIGIN ?? 'http://localhost:3001',
    ],
    credentials: true,
  });
  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));

  const swagger = new DocumentBuilder()
    .setTitle('Haggag Academy API')
    .setDescription('منصة الأستاذ محمد حجاج التعليمية — REST API')
    .setVersion('1.0')
    .addCookieAuth('access_token')
    .build();
  SwaggerModule.setup('docs', app, SwaggerModule.createDocument(app, swagger));

  await app.listen(process.env.PORT ?? 4000);
}
void bootstrap();
