import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // ১. CORS Setup: ফ্রন্টএন্ড থেকে রিকোয়েস্ট অ্যালাউ করার জন্য
  app.enableCors({
    origin: ['http://localhost:3000', 'http://localhost:3001'],
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    credentials: true,
  });

  // ২. Global Validation Pipe: ইনকামিং ডাটা চেক করার জন্য
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  // ৩. Server Listening
  const PORT = 3000;
  await app.listen(PORT);

  console.log('-------------------------------------------');
  console.log(`🚀 Hotel Royal Backend: http://localhost:${PORT}`);
  console.log('-------------------------------------------');
}

bootstrap();