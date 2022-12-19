import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config/dist';
import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { AppModule } from './app/app.module';
import { AuthGuard } from './auth/auth.guard';

async function bootstrap() {
    const app = await NestFactory.create<NestExpressApplication>(AppModule);
    app.useGlobalPipes(new ValidationPipe());

    const configService = app.get(ConfigService);
    app.useGlobalGuards(new AuthGuard(configService));

    const port = process.env.PORT || 8080;

    await app.listen(port);
}
bootstrap();
