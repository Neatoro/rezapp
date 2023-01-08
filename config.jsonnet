local usv = import 'userprovided.jsonnet';

{
    "src/frontend/.env": |||
        BACKEND_URL=http://localhost:3111
        AUTH_PROVIDER_URL=http://localhost:3111/auth
    |||,
    "src/backend/ormconfig.json": std.manifestJson({
        type: "sqlite",
        database: "recipes.db",
        synchronize: true
    }),
    "src/backend/.env": |||
        AUTH_PROVIDER_BASE_URL=http://localhost:3111/auth
    |||,
    "kong-local.yaml": std.manifestYamlDoc(
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
