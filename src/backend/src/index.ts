import { OTLPTraceExporter } from '@opentelemetry/exporter-trace-otlp-http';
import { registerInstrumentations } from '@opentelemetry/instrumentation';
import { NestInstrumentation } from '@opentelemetry/instrumentation-nestjs-core';
import { Resource } from '@opentelemetry/resources';
import {
    BatchSpanProcessor,
    NodeTracerProvider
} from '@opentelemetry/sdk-trace-node';
import { SemanticResourceAttributes } from '@opentelemetry/semantic-conventions';
import { HttpInstrumentation } from '@opentelemetry/instrumentation-http';
import { ExpressInstrumentation } from '@opentelemetry/instrumentation-express';

function setupOtel() {
    const provider = new NodeTracerProvider({
        resource: new Resource({
            [SemanticResourceAttributes.SERVICE_NAME]: 'backend'
        })
    });

    const exporter = new OTLPTraceExporter({
        url: 'http://rezapp-otel:4318/v1/traces'
    });
    provider.addSpanProcessor(new BatchSpanProcessor(exporter));

    provider.register();

    registerInstrumentations({
        instrumentations: [
            new NestInstrumentation(),
            new HttpInstrumentation(),
            new ExpressInstrumentation()
        ]
    });

    console.log('OTEL Initialized');
}

if (process.env.OTEL_ACTIVE === 'true') {
    setupOtel();
}

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
