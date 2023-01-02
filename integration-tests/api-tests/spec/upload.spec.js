const upload = require('./helpers/upload-helper');
const executeRequest = require('./helpers/request-helper');
const ProfileHelper = require('../../shared/profile-helper');
const path = require('path');
const imageCompare = require('./helpers/image-compare');

describe('Upload', () => {
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

    it('should upload an image', async () => {
        await profileHelper.apply('test-recipe');
        const imagePath = path.resolve(
            __dirname,
            'images',
            'example-image.jpg'
        );

        const uploadResponse = await upload(
            '/recipe/7ae7b1d7-f081-4203-ae9d-2839201d942d/image',
            { method: 'PUT' },
            imagePath
        );
        expect(uploadResponse.status).toBe(200);

        const imageResponse = await executeRequest(
            '/recipe/7ae7b1d7-f081-4203-ae9d-2839201d942d/image'
        );
        const blob = await imageResponse.blob();
        const data = await blob.arrayBuffer();

        const sameImage = await imageCompare(imagePath, Buffer.from(data));
        expect(sameImage).toBe(true);
    });
});
