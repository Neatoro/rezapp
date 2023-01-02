const ProfileHelper = require('../../shared/profile-helper');
const PuppeteerHelper = require('./helper/puppeteer-helper');
const CreatePage = require('./pages/CreatePage');
const OverviewPage = require('./pages/OverviewPage');
const UpdatePage = require('./pages/UpdatePage');
const ViewPage = require('./pages/ViewPage');

describe('Labels flow', () => {
    let profileHelper;
    let browser;

    let overviewPage;
    let viewPage;
    let createPage;
    let updatePage;

    beforeAll(async () => {
        jasmine.DEFAULT_TIMEOUT_INTERVAL = 30000;

        profileHelper = new ProfileHelper();
        browser = new PuppeteerHelper();
        await browser.setupBrowser();

        overviewPage = new OverviewPage(browser);
        viewPage = new ViewPage(browser);
        createPage = new CreatePage(browser);
        updatePage = new UpdatePage(browser);
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

    it('should display all labels in the overview page', async () => {
        await profileHelper.apply('test-recipe');

        await overviewPage.open();
        await overviewPage.waitForRecipes();

        const labels = await overviewPage.getLabels({ title: 'Test' });
        expect(labels).toEqual(['Test']);
    });

    it('should display all labels in the view page', async () => {
        await profileHelper.apply('test-recipe');

        await overviewPage.open();
        await overviewPage.waitForRecipes();

        await overviewPage.viewRecipe({ title: 'Test' });

        await browser.waitForNavigation();

        const labels = await viewPage.getLabels({ title: 'Test' });
        expect(labels).toEqual(['Test']);
    });

    it('should create a new label', async () => {
        await overviewPage.open();
        await overviewPage.newRecipe();

        await browser.waitForNavigation();

        await createPage.changeTab('Kategorien');
        await createPage.openCreateLabelModal();

        await createPage.createLabel('Test', 'green');

        await browser.page.waitForTimeout(100);

        const hasLabel = await createPage.hasLabel('Test');

        expect(hasLabel).toBe(true);
    });

    it('should filter by a label', async () => {
        await profileHelper.apply('test-recipes');

        await overviewPage.open();
        await overviewPage.waitForRecipes();

        let count = await overviewPage.getRecipeCount();
        expect(count).toBe(2);

        await overviewPage.applyLabel({ label: 'Vegan' });

        count = await overviewPage.getRecipeCount();
        expect(count).toBe(1);

        const correctRecipe = await overviewPage.hasRecipe({ title: 'Test' });
        expect(correctRecipe).toBe(true);
    });
});
