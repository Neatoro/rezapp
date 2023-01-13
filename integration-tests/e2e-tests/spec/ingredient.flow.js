const ProfileHelper = require('../../shared/profile-helper');
const PuppeteerHelper = require('./helper/puppeteer-helper');
const CreatePage = require('./pages/CreatePage');
const OverviewPage = require('./pages/OverviewPage');

describe('Ingredient flow', () => {
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

    it('should create a new ingredient', async () => {
        await overviewPage.open();
        await overviewPage.newRecipe();

        await browser.waitForNavigation();

        await createPage.changeTab('Zutaten');
        await createPage.openIngredientModal();
        await createPage.openCreateIngredientModal();
        await createPage.createIngredient('Test');

        const hasIngredient = await createPage.hasIngredient('Test');

        expect(hasIngredient).toBe(true);
    });

    it('should search for ingredient', async () => {
        await profileHelper.apply('test-ingredient');

        await overviewPage.open();
        await overviewPage.newRecipe();

        await createPage.changeTab('Zutaten');
        await createPage.openIngredientModal();

        await createPage.searchIngredient('Jack');

        const hasIngredient = await createPage.hasIngredient('Jackfruit');
        const hasNotIngredient = await createPage.hasIngredient('Sojasauce');

        expect(hasIngredient).toBe(true);
        expect(hasNotIngredient).toBe(false);
    });
});
