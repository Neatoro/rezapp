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

    it('should display an error toast if recipe could not be saved', async () => {
        await overviewPage.open();
        await overviewPage.newRecipe();

        await createPage.save();
        const hasError = await createPage.hasErrorMessage(
            'Das Rezept konnte nicht gespeichert werden. Bitte versuche es später erneut.'
        );
        expect(hasError).toBe(true);

        await browser.waitForSelector('div[role="alert"]', { hidden: true });
    });
});
