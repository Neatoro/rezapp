import { OTLPTraceExporter } from '@opentelemetry/exporter-trace-otlp-http';
import { Resource } from '@opentelemetry/resources';
import {
    BatchSpanProcessor,
    NodeTracerProvider
} from '@opentelemetry/sdk-trace-node';
import {
    SemanticAttributes,
    SemanticResourceAttributes
} from '@opentelemetry/semantic-conventions';
import { SpanKind, context, propagation } from '@opentelemetry/api';

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

async function bootstrap() {
    const { handler } = await import('./handler.js');
    const { default: express } = await import('express');

    const app = express();

    const otelHandler = async (request, response) => {
        const tracer = provider.getTracer('frontend');
        const newContext = propagation.extract(
            context.active(),
            request.headers
        );

        const span = tracer.startSpan(
            `${request.method} ${request.path}`,
            {
                kind: SpanKind.SERVER
            },
            newContext
        );
        span.setAttribute(SemanticAttributes.HTTP_METHOD, request.method);
        request.headers['traceparent'] = `00-${span.spanContext().traceId}-${
            span.spanContext().spanId
        }-${span
            .spanContext()
            .traceFlags.toString(16)
            .padStart(2, '0')}`.toLowerCase();

        console.log(request.headers['traceparent']);

        handler(request, response);
        response.once('finish', () => {
            span.end();
        });
    };

    app.use(otelHandler);
    app.listen(3000, () => console.log('started on port 3000'));
}
bootstrap();
