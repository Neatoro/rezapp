const executeRequest = require('./helpers/request-helper');
const proxyHelper = require('./helpers/proxy-helper');

describe('Authentication', () => {
    afterAll(async () => {
        await proxyHelper.changeAuthState();
    });

    beforeEach(async () => {
        await proxyHelper.changeAuthState({
            isAuthenticated: false
        });
    });

    const endpoints = [
        {
            path: '/recipe',
            methods: ['GET', 'POST']
        },
        {
            path: '/recipe/some-id',
            methods: ['GET', 'DELETE', 'PUT']
        },
        {
            path: '/ingredient',
            methods: ['GET', 'POST']
        },
        {
            path: '/label',
            methods: ['GET']
        }
    ];

    for (const endpoint of endpoints) {
        for (const method of endpoint.methods) {
            it(`should disallow access for ${method} ${endpoint.path}`, async () => {
                const response = await executeRequest(endpoint.path, {
                    method
                });
                const data = await response.json();

                expect(response.status).toBe(401);
                expect(data).toEqual({
                    statusCode: 401,
                    message: 'Unauthorized'
                });
            });
        }
    }
});
