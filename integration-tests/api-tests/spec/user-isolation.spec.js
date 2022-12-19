const executeRequest = require('./helpers/request-helper');
const proxyHelper = require('./helpers/proxy-helper');
const ProfileHelper = require('../../shared/profile-helper');

describe('User Isolation', () => {
    let profileHelper;

    beforeAll(() => {
        profileHelper = new ProfileHelper();
    });

    afterAll(async () => {
        await profileHelper.cleanSetup();
        await proxyHelper.changeAuthState();
        profileHelper.close();
    });

    beforeEach(async () => {
        await profileHelper.cleanSetup();
        await proxyHelper.changeAuthState({
            isAuthenticated: true,
            user: {
                sub: '9876543210'
            }
        });
    });

    describe('list', () => {
        it('should not return other users recipes', async () => {
            await profileHelper.apply('simple-recipe');

            const response = await executeRequest('/recipe');
            const data = await response.json();

            expect(response.status).toBe(200);
            expect(data).toEqual({
                recipes: []
            });
        });

        it('should not return other users ingredients', async () => {
            await profileHelper.apply('simple-recipe');

            const response = await executeRequest('/ingredient');
            const data = await response.json();

            expect(response.status).toBe(200);
            expect(data).toEqual({
                ingredients: []
            });
        });
    });

    describe('get', () => {
        it('should not return other users recipes', async () => {
            await profileHelper.apply('simple-recipe');

            const response = await executeRequest(
                '/recipe/7ae7b1d7-f081-4203-ae9d-2839201d942d'
            );
            const data = await response.json();

            expect(response.status).toBe(404);
            expect(data).toEqual({
                statusCode: 404,
                message: 'Not Found'
            });
        });
    });

    describe('delete', () => {
        it('should not delete other users recipe', async () => {
            await profileHelper.apply('test-recipe');
            const response = await executeRequest(
                '/recipe/7ae7b1d7-f081-4203-ae9d-2839201d942d',
                {
                    method: 'DELETE'
                }
            );
            const data = await response.json();

            expect(response.status).toBe(404);
            expect(data).toEqual({
                statusCode: 404,
                message: 'Not Found'
            });
        });
    });

    describe('update', () => {
        it('should not update other users recipe', async () => {
            await profileHelper.apply('test-recipe');

            const response = await executeRequest(
                '/recipe/7ae7b1d7-f081-4203-ae9d-2839201d942d',
                {
                    method: 'PUT',
                    headers: {
                        'content-type': 'application/json'
                    },
                    body: JSON.stringify({
                        name: 'Foo',
                        description: 'Bar'
                    })
                }
            );
            const data = await response.json();

            expect(response.status).toBe(404);
            expect(data).toEqual({
                statusCode: 404,
                message: 'Not Found'
            });
        });
    });
});
