import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as dotenv from 'dotenv';
import * as cookieParser from 'cookie-parser';
import { ValidationPipe } from '@nestjs/common';
import 'reflect-metadata';
dotenv.config();
// import cors from 'cors';
// import { JwtMiddleware } from './jwt/jwt.middleware';

// APP_VERSION: 1.0.1

const optionsCors = {
  origin: "*",
  // origin: "https://svisni-sushi.ru",
  allowedHeaders: "Origin,X-Requested-With,Content-Type,Accept",
  methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
  optionsSuccessStatus: 200
};

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe());
  app.use(cookieParser());
  // app.use(cors(optionsCors));
  app.enableCors(optionsCors);
  // app.use(JwtMiddleware) function
  await app.listen(5000, '0.0.0.0');
}
bootstrap();
