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
            expect(data).toEqual({ labels: [
                {
                    "id": "b838f03f-c9ad-4051-9ddc-c090887efeb3",
                    "name": "Vegan",
                    "user": "0123456789",
                    color: 'green'
                },
                {
                    "id": "bc09a712-d1b9-4b1a-8477-61a76648d7c7",
                    "name": "Kuchen",
                    "user": "0123456789",
                    color: 'red'
                }
            ] });
        });

    });

});