const executeRequest = require('./helpers/request-helper');
const ProfileHelper = require('../../shared/profile-helper');

describe('Ingredient', () => {
    beforeAll(() => {
        profileHelper = new ProfileHelper();
    });

    afterAll(async () => {
        await profileHelper.cleanSetup();
        profileHelper.close();
    });

    beforeEach(async () => {
        await profileHelper.cleanSetup();
    });

    describe('list', () => {
        it('should return an empty list when no recipes exists', async () => {
            const response = await executeRequest('/ingredient');
            const data = await response.json();

            expect(response.status).toBe(200);
            expect(data).toEqual({ ingredients: [] });
        });

        it('should return all ingredients', async () => {
            await profileHelper.apply('test-ingredient');

            const response = await executeRequest('/ingredient');
            const data = await response.json();

            expect(response.status).toBe(200);
            expect(data).toEqual({
                ingredients: [
                    {
                        id: '6961db05-7a8a-40d8-ad9b-0873dc23e271',
                        name: 'Jackfruit',
                        user: '0123456789'
                    },
                    {
                        id: '2e08f4d1-8c9c-479b-86f6-fb10d442543b',
                        name: 'Sojasauce',
                        user: '0123456789'
                    }
                ]
            });
        });
    });

    describe('create', () => {
        it('should create a new ingredient', async () => {
            const response = await executeRequest('/ingredient', {
                method: 'POST',
                headers: {
                    'content-type': 'application/json'
                },
                body: JSON.stringify({
                    name: 'Test'
                })
            });
            const data = await response.json();
            const { id, ...exceptId } = data;

            expect(response.status).toBe(201);
            expect(id).toMatch(
                /^[0-9a-f]{8}-[0-9a-f]{4}-[0-5][0-9a-f]{3}-[089ab][0-9a-f]{3}-[0-9a-f]{12}$/i
            );
            expect(exceptId).toEqual({
                name: 'Test',
                user: '0123456789'
            });
        });

        it('should fail if no name is provided', async () => {
            const response = await executeRequest('/ingredient', {
                method: 'POST',
                headers: {
                    'content-type': 'application/json'
                },
                body: JSON.stringify({})
            });

            const data = await response.json();

            expect(response.status).toBe(400);
            expect(data).toEqual({
                statusCode: 400,
                message: ['name must be a string', 'name should not be empty'],
                error: 'Bad Request'
            });
        });

        it('should fail if no name is not a string', async () => {
            const response = await executeRequest('/ingredient', {
                method: 'POST',
                headers: {
                    'content-type': 'application/json'
                },
                body: JSON.stringify({
                    name: 120
                })
            });

            const data = await response.json();

            expect(response.status).toBe(400);
            expect(data).toEqual({
                statusCode: 400,
                message: ['name must be a string'],
                error: 'Bad Request'
            });
        });
    });
});
