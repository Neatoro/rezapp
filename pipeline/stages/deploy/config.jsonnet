local usv = import 'values.jsonnet';

{
    "config/ormconfig.json": std.manifestJson({
        type: 'postgres',
        host: 'rezapp-database',
        username: usv.postgres.username,
        password: usv.postgres.password,
        database: usv.postgres.username
    }),
    "config/postgres.env": |||
        POSTGRES_USER=%(username)s
        POSTGRES_PASSWORD=%(password)s
    ||| % {username: usv.postgres.username, password: usv.postgres.password},
    "config/otel.yaml": std.manifestYamlDoc({
        receivers: {
            otlp: {
                protocols: {
                    http: null
                }
            }
        },
        processors: {
            batch: null
        },
        extensions: {
            health_check: null,
            pprof: null,
            zpages: null
        },
        exporters: {
            zipkin: {
                endpoint: "http://rezapp-zipkin:9411/api/v2/spans",
                tls: {
                    insecure: true
                }
            }
        },
        service: {
            extensions: [
                "health_check",
                "pprof",
                "zpages"
            ],
            pipelines: {
                traces: {
                    receivers: [
                        "otlp"
                    ],
                    processors: [
                        "batch"
                    ],
                    exporters: [
                        "zipkin"
                    ]
                }
            }
        }
    }),
    "config/kong.yaml": std.manifestYamlDoc(
        {
            _format_version: "3.0",
            _transform: true,
            plugins: [
                {
                    name: "opentelemetry",
                    config: {
                        endpoint: "http://rezapp-otel:4318/v1/traces"
                    }
                }
            ],
            services: [
                {
                    host: "rezapp-backend",
                    name: "backend",
                    port: 8080,
                    protocol: "http",
                    routes: [
                        {
                            name: "api-route",
                            paths: [
                                "/api"
                            ],
                            strip_path: true
                        }
                    ]
                },
                {
                    host: "rezapp-auth-provider",
                    name: "auth-provider",
                    port: 3222,
                    protocol: "http",
                    routes: [
                        {
                            name: "auth-provider-route",
                            paths: [
                                "/auth"
                            ],
                            strip_path: false
                        }
                    ]
                },
                {
                    host: "rezapp-frontend",
                    name: "frontend",
                    port: 3000,
                    protocol: "http",
                    routes: [
                        {
                            name: "frontend-route",
                            paths: [
                                "/"
                            ],
                            strip_path: false
                        }
                    ]
                },
                {
                    host: "rezapp-zipkin",
                    name: "zipkin",
                    port: 9411,
                    protocol: "http",
                    routes: [
                        {
                            name: "zipkin-route",
                            paths: [
                                "/zipkin"
                            ],
                            strip_path: false
                        }
                    ],
                    plugins: [
                        {
                            name: "basic-auth",
                            config: {
                                hide_credentials: true
                            }
                        }
                    ]
                }
            ],
            consumers: [
                {
                    username: "zipkin"
                }
            ],
            basicauth_credentials: [
                {
                    consumer: "zipkin",
                    username: usv.zipkin.username,
                    password: usv.zipkin.password
                }
            ]
        },
        indent_array_in_object=true,
        quote_keys=false
    )
}
