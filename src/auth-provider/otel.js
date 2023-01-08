const {
    NodeTracerProvider,
    BatchSpanProcessor
} = require('@opentelemetry/sdk-trace-node');
const { Resource } = require('@opentelemetry/resources');
const {
    SemanticResourceAttributes
} = require('@opentelemetry/semantic-conventions');
const { registerInstrumentations } = require('@opentelemetry/instrumentation');
const { HttpInstrumentation } = require('@opentelemetry/instrumentation-http');
const {
    ExpressInstrumentation
} = require('@opentelemetry/instrumentation-express');
const {
    OTLPTraceExporter
} = require('@opentelemetry/exporter-trace-otlp-http');

const provider = new NodeTracerProvider({
    resource: new Resource({
        [SemanticResourceAttributes.SERVICE_NAME]: 'auth-provider'
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
