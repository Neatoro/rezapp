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
        it('should return an empty list when no labels exists', async () => {
            const response = await executeRequest('/label');
            const data = await response.json();

            expect(response.status).toBe(200);
            expect(data).toEqual({ labels: [] });
        });

        it('should return a correct list of labels', async () => {
            await profileHelper.apply('labels');

            const response = await executeRequest('/label');
            const data = await response.json();

            expect(response.status).toBe(200);
            expect(data).toEqual({
                labels: [
                    {
                        id: 'b838f03f-c9ad-4051-9ddc-c090887efeb3',
                        name: 'Vegan',
                        user: '0123456789',
                        color: 'green'
                    },
                    {
                        id: 'bc09a712-d1b9-4b1a-8477-61a76648d7c7',
                        name: 'Kuchen',
                        user: '0123456789',
                        color: 'red'
                    }
                ]
            });
        });
    });

    describe('create', () => {
        it('should fail if there is no name provided', async () => {
            const response = await executeRequest('/label', {
                method: 'POST',
                headers: {
                    'content-type': 'application/json'
                },
                body: JSON.stringify({
                    color: 'green'
                })
            });
            const data = await response.json();

            expect(response.status).toBe(400);
            expect(data).toEqual({
                statusCode: 400,
                error: 'Bad Request',
                message: ['name should not be empty', 'name must be a string']
            });
        });

        it('should fail if name is not a string', async () => {
            const response = await executeRequest('/label', {
                method: 'POST',
                headers: {
                    'content-type': 'application/json'
                },
                body: JSON.stringify({
                    name: false,
                    color: 'green'
                })
            });
            const data = await response.json();

            expect(response.status).toBe(400);
            expect(data).toEqual({
                statusCode: 400,
                error: 'Bad Request',
                message: ['name must be a string']
            });
        });

        it('should fail if there is no color provided', async () => {
            const response = await executeRequest('/label', {
                method: 'POST',
                headers: {
                    'content-type': 'application/json'
                },
                body: JSON.stringify({
                    name: 'vegan'
                })
            });
            const data = await response.json();

            expect(response.status).toBe(400);
            expect(data).toEqual({
                statusCode: 400,
                error: 'Bad Request',
                message: [
                    'color should not be empty',
                    'color must be one of the following values: default, dark, red, green, yellow, indigo, purple, pink'
                ]
            });
        });

        it('should fail if color is not a string', async () => {
            const response = await executeRequest('/label', {
                method: 'POST',
                headers: {
                    'content-type': 'application/json'
                },
                body: JSON.stringify({
                    name: 'vegan',
                    color: false
                })
            });
            const data = await response.json();

            expect(response.status).toBe(400);
            expect(data).toEqual({
                statusCode: 400,
                error: 'Bad Request',
                message: [
                    'color must be one of the following values: default, dark, red, green, yellow, indigo, purple, pink'
                ]
            });
        });

        it('should fail if color is not a valid value', async () => {
            const response = await executeRequest('/label', {
                method: 'POST',
                headers: {
                    'content-type': 'application/json'
                },
                body: JSON.stringify({
                    name: 'vegan',
                    color: 'white'
                })
            });
            const data = await response.json();

            expect(response.status).toBe(400);
            expect(data).toEqual({
                statusCode: 400,
                error: 'Bad Request',
                message: [
                    'color must be one of the following values: default, dark, red, green, yellow, indigo, purple, pink'
                ]
            });
        });

        it('should create a label', async () => {
            const response = await executeRequest('/label', {
                method: 'POST',
                headers: {
                    'content-type': 'application/json'
                },
                body: JSON.stringify({
                    name: 'vegan',
                    color: 'green'
                })
            });
            const data = await response.json();
            const { id, ...exceptId } = data;

            expect(response.status).toBe(201);
            expect(id).toMatch(
                /^[0-9a-f]{8}-[0-9a-f]{4}-[0-5][0-9a-f]{3}-[089ab][0-9a-f]{3}-[0-9a-f]{12}$/i
            );
            expect(exceptId).toEqual({
                name: 'vegan',
                color: 'green',
                user: '0123456789'
            });
        });
    });
});
