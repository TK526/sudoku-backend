import { NestFactory } from '@nestjs/core';
import { AppModule } from './modules/app/app.module';
import { ValidationPipe } from '@nestjs/common';

//Change port from here
const BACKEND_PORT = 3000;

 // Frontend URL
const FRONTEND_URL = 'http://localhost:5173';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const cors = require('cors');

  // Setup CORS middleware
  app.use(cors({
    origin: FRONTEND_URL,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
  }));
  
  // Error Handling
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      forbidNonWhitelisted: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
    }),
  );

  await app.listen(BACKEND_PORT);
}
bootstrap();
