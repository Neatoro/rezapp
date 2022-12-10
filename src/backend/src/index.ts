import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { AppModule } from './app/app.module';

async function bootstrap() {
    const app = await NestFactory.create<NestExpressApplication>(AppModule);

    const port = process.env.PORT || 8080;

    await app.listen(port);
}
bootstrap();
