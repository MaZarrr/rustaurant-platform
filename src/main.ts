import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as dotenv from 'dotenv';
import * as cookieParser from 'cookie-parser';
import { ValidationPipe } from '@nestjs/common';
import 'reflect-metadata';
import { JwtMiddleware } from './jwt/jwt.middleware';
dotenv.config();

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe());
  // app.use(cookieParser());
  // app.enableCors({
  //    origin: '*'
  // });
  // app.use(JwtMiddleware) function
  await app.listen(3000);
}
bootstrap();
