const ProfileHelper = require('../../shared/profile-helper');
const PuppeteerHelper = require('./helper/puppeteer-helper');
const OverviewPage = require('./pages/OverviewPage');

describe('Basic flow', () => {

    let profileHelper;
    let browser;
    let overviewPage;

    beforeAll(() => {
        profileHelper = new ProfileHelper();
        browser = new PuppeteerHelper();
        overviewPage = new OverviewPage(browser);
    });

    beforeEach(async () => {
        await profileHelper.cleanSetup();
        await browser.setupPage();
    });

    afterEach(async () => {
        await browser.close();
    });

    it('should have Rezapp in header', async () => {
        await overviewPage.open();
        const headerText = await overviewPage.getHeaderText();
        expect(headerText).toBe('Rezapp');
    });

});
