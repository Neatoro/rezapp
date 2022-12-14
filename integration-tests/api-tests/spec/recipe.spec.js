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
            const response = await fetch('http://localhost:8080/recipe');
            const data = await response.json();

            expect(response.status).toBe(200);
            expect(data).toEqual({ recipes: [] });
        });

        it('should return existing recipes', async () => {
            await profileHelper.apply('simple-recipe');

            const response = await fetch('http://localhost:8080/recipe');
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
            const response = await fetch(
                'http://localhost:8080/recipe/foo-bar'
            );

            expect(response.status).toBe(404);
        });

        it('should return correct recipe', async () => {
            await profileHelper.apply('test-recipe');

            const response = await fetch(
                'http://localhost:8080/recipe/7ae7b1d7-f081-4203-ae9d-2839201d942d'
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
});
