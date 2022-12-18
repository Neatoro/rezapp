const ProfileHelper = require('../../shared/profile-helper');
const PuppeteerHelper = require('./helper/puppeteer-helper');
const CreatePage = require('./pages/CreatePage');
const OverviewPage = require('./pages/OverviewPage');

describe('Error flow', () => {
    let profileHelper;
    let browser;

    let overviewPage;
    let createPage;

    beforeAll(async () => {
        jasmine.DEFAULT_TIMEOUT_INTERVAL = 30000;

        profileHelper = new ProfileHelper();
        browser = new PuppeteerHelper();
        await browser.setupBrowser();

        overviewPage = new OverviewPage(browser);
        createPage = new CreatePage(browser);
    });

    beforeEach(async () => {
        await profileHelper.cleanSetup();
        await browser.setupPage();
    });

    afterEach(async () => {
        await browser.close();
    });

    afterAll(async () => {
        await profileHelper.cleanSetup();
        await profileHelper.close();
        await browser.tearDown();
    });

    it('should display an error message if recipe has no name and description', async () => {
        await overviewPage.open();
        await overviewPage.newRecipe();

        await createPage.save();
        const nameError = await createPage.getInputErrorText('#nameDesc');
        const descriptionError = await createPage.getInputErrorText(
            '#descriptionDesc'
        );

        expect(nameError).toEqual('Dieses Feld ist erforderlich!');
        expect(descriptionError).toEqual('Dieses Feld ist erforderlich!');
    });
});
