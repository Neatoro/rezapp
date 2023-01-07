import { OTLPTraceExporter } from '@opentelemetry/exporter-trace-otlp-http';
import { registerInstrumentations } from '@opentelemetry/instrumentation';
import { Resource } from '@opentelemetry/resources';
import {
    BatchSpanProcessor,
    NodeTracerProvider
} from '@opentelemetry/sdk-trace-node';
import { SemanticResourceAttributes } from '@opentelemetry/semantic-conventions';
import { HttpInstrumentation } from '@opentelemetry/instrumentation-http';
import { ExpressInstrumentation } from '@opentelemetry/instrumentation-express';

const provider = new NodeTracerProvider({
    resource: new Resource({
        [SemanticResourceAttributes.SERVICE_NAME]: 'frontend'
    })
});

const exporter = new OTLPTraceExporter({
    url: 'http://rezapp-otel:4318/v1/traces'
});
provider.addSpanProcessor(new BatchSpanProcessor(exporter));

provider.register();

registerInstrumentations({
    instrumentations: [new HttpInstrumentation(), new ExpressInstrumentation()]
});

async function bootstrap() {
    const { handler } = await import('./handler.js');
    const { default: express } = await import('express');

    const app = express();
    app.use(handler);
    app.listen(3000, () => console.log('started on port 3000'));
}
bootstrap();
