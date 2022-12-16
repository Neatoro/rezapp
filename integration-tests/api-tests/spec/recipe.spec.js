const executeRequest = require('./helpers/request-helper');
const ProfileHelper = require('./helpers/profile-helper');

describe('Recipe', () => {
    let profileHelper;

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
            const response = await executeRequest('/recipe');
            const data = await response.json();

            expect(response.status).toBe(200);
            expect(data).toEqual({ recipes: [] });
        });

        it('should return existing recipes', async () => {
            await profileHelper.apply('simple-recipe');

            const response = await executeRequest('/recipe');
            const data = await response.json();

            expect(response.status).toBe(200);
            expect(data).toEqual({
                recipes: [
                    {
                        id: '7ae7b1d7-f081-4203-ae9d-2839201d942d',
                        name: 'Ofengemüse mit Jackfruit und Zitronen-Kapern-Sauce',
                        description:
                            'Ein schnelles Gericht, perfekt im Herbst und Winter.',
                        image: false
                    }
                ]
            });
        });
    });

    describe('get', () => {
        it('should 404 if recipe does not exists', async () => {
            const response = await executeRequest('/recipe/foo-bar');

            expect(response.status).toBe(404);
        });

        it('should return correct recipe', async () => {
            await profileHelper.apply('test-recipe');

            const response = await executeRequest(
                '/recipe/7ae7b1d7-f081-4203-ae9d-2839201d942d'
            );
            const data = await response.json();

            expect(response.status).toBe(200);
            expect(data).toEqual({
                id: '7ae7b1d7-f081-4203-ae9d-2839201d942d',
                name: 'Test',
                description: 'Test',
                image: false,
                steps: [
                    {
                        id: '8dae1913-517f-4d5e-9c23-14cb1a5b3cb3',
                        description: 'Test',
                        rank: 0
                    }
                ],
                ingredients: [
                    {
                        id: '03ff41b7-9faf-47a6-ac3a-efcbb20a2e1a',
                        amount: 225,
                        unit: 'g',
                        ingredient: {
                            id: '6961db05-7a8a-40d8-ad9b-0873dc23e271',
                            name: 'Test'
                        }
                    }
                ]
            });
        });
    });

    describe('create', () => {
        it('should fail if empty body is provided', async () => {
            const response = await executeRequest('/recipe', {
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
                message: [
                    'name must be a string',
                    'name should not be empty',
                    'description must be a string',
                    'description should not be empty'
                ],
                error: 'Bad Request'
            });
        });

        it('should fail if name is not provided', async () => {
            const response = await executeRequest('/recipe', {
                method: 'POST',
                headers: {
                    'content-type': 'application/json'
                },
                body: JSON.stringify({
                    description: 'Test'
                })
            });
            const data = await response.json();

            expect(response.status).toBe(400);
            expect(data).toEqual({
                statusCode: 400,
                message: ['name must be a string', 'name should not be empty'],
                error: 'Bad Request'
            });
        });

        it('should fail if name is not a string', async () => {
            const response = await executeRequest('/recipe', {
                method: 'POST',
                headers: {
                    'content-type': 'application/json'
                },
                body: JSON.stringify({
                    name: true,
                    description: 'Test'
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

        it('should fail if name is not provided', async () => {
            const response = await executeRequest('/recipe', {
                method: 'POST',
                headers: {
                    'content-type': 'application/json'
                },
                body: JSON.stringify({
                    name: 'Test'
                })
            });
            const data = await response.json();

            expect(response.status).toBe(400);
            expect(data).toEqual({
                statusCode: 400,
                message: [
                    'description must be a string',
                    'description should not be empty'
                ],
                error: 'Bad Request'
            });
        });

        it('should fail if name is not a string', async () => {
            const response = await executeRequest('/recipe', {
                method: 'POST',
                headers: {
                    'content-type': 'application/json'
                },
                body: JSON.stringify({
                    name: 'Test',
                    description: true
                })
            });
            const data = await response.json();

            expect(response.status).toBe(400);
            expect(data).toEqual({
                statusCode: 400,
                message: ['description must be a string'],
                error: 'Bad Request'
            });
        });

        it('should fail if steps do not have a description', async () => {
            const response = await executeRequest('/recipe', {
                method: 'POST',
                headers: {
                    'content-type': 'application/json'
                },
                body: JSON.stringify({
                    name: 'Test',
                    description: 'Test',
                    steps: [{ description: 'foo'}, { name: 'bla' }]
                })
            });
            const data = await response.json();

            expect(response.status).toBe(400);
            expect(data).toEqual({
                statusCode: 400,
                message: ['steps.1.description must be a string', 'steps.1.description should not be empty'],
                error: 'Bad Request'
            });
        });

        it('should fail if ingredient id is not provided', async () => {
            const response = await executeRequest('/recipe', {
                method: 'POST',
                headers: {
                    'content-type': 'application/json'
                },
                body: JSON.stringify({
                    name: 'Test',
                    description: 'Test',
                    ingredients: [
                        {
                            amount: 3,
                            unit: 'g'
                        }
                    ]
                })
            });
            const data = await response.json();

            expect(response.status).toBe(400);
            expect(data).toEqual({
                statusCode: 400,
                message: [
                    'ingredients.0.ingredient must be a string',
                    'ingredients.0.ingredient should not be empty'
                ],
                error: 'Bad Request'
            });
        });

        it('should fail if ingredient id is not a string', async () => {
            const response = await executeRequest('/recipe', {
                method: 'POST',
                headers: {
                    'content-type': 'application/json'
                },
                body: JSON.stringify({
                    name: 'Test',
                    description: 'Test',
                    ingredients: [
                        {
                            ingredient: true,
                            amount: 3,
                            unit: 'g'
                        }
                    ]
                })
            });
            const data = await response.json();

            expect(response.status).toBe(400);
            expect(data).toEqual({
                statusCode: 400,
                message: ['ingredients.0.ingredient must be a string'],
                error: 'Bad Request'
            });
        });

        it('should fail if ingredient amount is not a number', async () => {
            const response = await executeRequest('/recipe', {
                method: 'POST',
                headers: {
                    'content-type': 'application/json'
                },
                body: JSON.stringify({
                    name: 'Test',
                    description: 'Test',
                    ingredients: [
                        {
                            ingredient: 'Test',
                            amount: '3',
                            unit: 'g'
                        }
                    ]
                })
            });
            const data = await response.json();

            expect(response.status).toBe(400);
            expect(data).toEqual({
                statusCode: 400,
                message: [
                    'ingredients.0.amount must be a number conforming to the specified constraints'
                ],
                error: 'Bad Request'
            });
        });

        it('should fail if ingredient unit is not a string', async () => {
            const response = await executeRequest('/recipe', {
                method: 'POST',
                headers: {
                    'content-type': 'application/json'
                },
                body: JSON.stringify({
                    name: 'Test',
                    description: 'Test',
                    ingredients: [
                        {
                            ingredient: 'Test',
                            amount: 3,
                            unit: true
                        }
                    ]
                })
            });
            const data = await response.json();

            expect(response.status).toBe(400);
            expect(data).toEqual({
                statusCode: 400,
                message: ['ingredients.0.unit must be a string'],
                error: 'Bad Request'
            });
        });

        it('should create a recipe without ingredients and steps', async () => {
            const response = await executeRequest('/recipe', {
                method: 'POST',
                headers: {
                    'content-type': 'application/json'
                },
                body: JSON.stringify({
                    name: 'Test',
                    description: 'Test'
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
                description: 'Test',
                steps: [],
                ingredients: [],
                image: false
            });
        });

        it('should create a recipe without ingredients', async () => {
            const response = await executeRequest('/recipe', {
                method: 'POST',
                headers: {
                    'content-type': 'application/json'
                },
                body: JSON.stringify({
                    name: 'Test',
                    description: 'Test',
                    steps: [{ description: 'Foo bar' }]
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
                description: 'Test',
                steps: [
                    jasmine.objectContaining({
                        description: 'Foo bar',
                        rank: 0
                    })
                ],
                ingredients: [],
                image: false
            });
        });

        it('should create a recipe without steps', async () => {
            await profileHelper.apply('test-ingredient');

            const response = await executeRequest('/recipe', {
                method: 'POST',
                headers: {
                    'content-type': 'application/json'
                },
                body: JSON.stringify({
                    name: 'Test',
                    description: 'Test',
                    ingredients: [
                        {
                            ingredient: '6961db05-7a8a-40d8-ad9b-0873dc23e271',
                            amount: 200,
                            unit: 'g'
                        }
                    ]
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
                description: 'Test',
                steps: [],
                ingredients: [
                    jasmine.objectContaining({
                        ingredient: {
                            id: '6961db05-7a8a-40d8-ad9b-0873dc23e271'
                        },
                        amount: 200,
                        unit: 'g'
                    })
                ],
                image: false
            });
        });

        it('should create a recipe with ingredients and steps', async () => {
            await profileHelper.apply('test-ingredient');

            const response = await executeRequest('/recipe', {
                method: 'POST',
                headers: {
                    'content-type': 'application/json'
                },
                body: JSON.stringify({
                    name: 'Test',
                    description: 'Test',
                    steps: [{ description: 'Foo bar' }],
                    ingredients: [
                        {
                            ingredient: '6961db05-7a8a-40d8-ad9b-0873dc23e271',
                            amount: 200,
                            unit: 'g'
                        }
                    ]
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
                description: 'Test',
                steps: [
                    jasmine.objectContaining({
                        description: 'Foo bar',
                        rank: 0
                    })
                ],
                ingredients: [
                    jasmine.objectContaining({
                        ingredient: {
                            id: '6961db05-7a8a-40d8-ad9b-0873dc23e271'
                        },
                        amount: 200,
                        unit: 'g'
                    })
                ],
                image: false
            });
        });
    });
});
