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
            const data = await response.json();

            expect(response.status).toBe(404);
        });
    });
});
