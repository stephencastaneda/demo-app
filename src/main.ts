import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors({
    origin: [
      'https://9356-2603-8000-7b00-a096-f49f-6cc3-5758-1e1d.ngrok-free.app',
      'https://9356-2603-8000-7b00-a096-f49f-6cc3-5758-1e1d.ngrok-free.app/auth/facebook',
    ],
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    allowedHeaders: 'Content-Type, Accept, Authorization',
  });

  await app.listen(4000);
}
bootstrap();
