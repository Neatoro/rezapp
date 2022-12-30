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
    |||
}