const ProfileHelper = require('../../shared/profile-helper');
const PuppeteerHelper = require('./helper/puppeteer-helper');
const OverviewPage = require('./pages/OverviewPage');
const ViewPage = require('./pages/ViewPage');

describe('Basic flow', () => {
    let profileHelper;
    let browser;
    let overviewPage;
    let viewPage;

    beforeAll(() => {
        jasmine.DEFAULT_TIMEOUT_INTERVAL = 30000;

        profileHelper = new ProfileHelper();
        browser = new PuppeteerHelper();
        overviewPage = new OverviewPage(browser);
        viewPage = new ViewPage(browser);
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

    it('should display the correct recipe', async () => {
        await profileHelper.apply('test-recipe');

        await overviewPage.open();
        await overviewPage.viewRecipe({
            id: '7ae7b1d7-f081-4203-ae9d-2839201d942d'
        });

        const titleText = await viewPage.getTitle();
        expect(titleText).toBe('Test');

        const descriptionText = await viewPage.getDescription();
        expect(descriptionText).toBe('Test');

        const ingredients = await viewPage.getIngredients();
        expect(ingredients).toEqual([{ name: 'Test', amount: '225 g' }]);

        const steps = await viewPage.getSteps();
        expect(steps).toEqual(['Test']);
    });
});
