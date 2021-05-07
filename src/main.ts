import { NestFactory } from '@nestjs/core';
import * as cookieParser from 'cookie-parser';
import { AppModule } from './app.module';

const start = async () => {
  try {
    const PORT = process.env.PORT || 5000;
    const app = await NestFactory.create(AppModule);

    app.use(cookieParser());
    app.enableCors({
      origin: 'http://localhost:3000',
      credentials: true,
    });

    await app.listen(PORT, () =>
      console.log(`Запуск сервера на порту: ${PORT}`),
    );
  } catch (e) {
    console.log(e);
  }
};

start();
