const ProfileHelper = require('../../shared/profile-helper');
const PuppeteerHelper = require('./helper/puppeteer-helper');
const CreatePage = require('./pages/CreatePage');
const OverviewPage = require('./pages/OverviewPage');
const UpdatePage = require('./pages/UpdatePage');
const ViewPage = require('./pages/ViewPage');

describe('Basic flow', () => {
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

    it('should have Rezapp in header', async () => {
        await overviewPage.open();
        const headerText = await overviewPage.getHeaderText();
        expect(headerText).toBe('Rezapp');
    });

    it('should toggle dark mode', async () => {
        await overviewPage.open();
        await browser.evaluate(() => {
            localStorage.clear();
            window.location.reload();
        });

        await browser.waitForSelector('.dark');

        const beforeFirstToggle = await overviewPage.isDarkMode();
        expect(beforeFirstToggle).toBe(true);

        await overviewPage.toggleDarkMode();
        const afterFirstToggle = await overviewPage.isDarkMode();
        expect(afterFirstToggle).toBe(false);

        await overviewPage.toggleDarkMode();
        const afterSecondToggle = await overviewPage.isDarkMode();
        expect(afterSecondToggle).toBe(true);
    });

    it('should display the correct recipe', async () => {
        await profileHelper.apply('test-recipe');

        await overviewPage.open();
        await overviewPage.waitForRecipes();

        await overviewPage.viewRecipe({
            title: 'Test'
        });

        const titleText = await viewPage.getTitle();
        expect(titleText).toBe('Test');

        const descriptionText = await viewPage.getDescription();
        expect(descriptionText).toBe('Test');

        const ingredients = await viewPage.getIngredients();
        expect(ingredients).toEqual([{ name: 'Test', amount: '225 g' }]);

        const steps = await viewPage.getSteps();
        expect(steps).toEqual(['Test']);

        const portions = await viewPage.getPortions();
        expect(portions).toBe(1);
    });

    it('should create a new recipe', async () => {
        await profileHelper.apply('test-ingredient');

        await overviewPage.open();
        await overviewPage.newRecipe();

        await createPage.enterName('Foo Bar Name');
        await createPage.enterDescription('Foo Bar Description');
        await createPage.enterPortions('3');

        await createPage.changeTab('Arbeitsschritte');
        await createPage.enterStep(0, 'Foo Bar Step');

        await createPage.changeTab('Zutaten');
        await createPage.enterIngredient('Jackfruit', '200', 'g');

        await createPage.save();

        await overviewPage.waitForRecipes();

        await overviewPage.hasMessage('Rezept wurde erfolgreich angelegt!');
        await overviewPage.viewRecipe({
            title: 'Foo Bar Name'
        });

        const titleText = await viewPage.getTitle();
        expect(titleText).toBe('Foo Bar Name');

        const descriptionText = await viewPage.getDescription();
        expect(descriptionText).toBe('Foo Bar Description');

        const portions = await viewPage.getPortions();
        expect(portions).toBe(3);

        const ingredients = await viewPage.getIngredients();
        expect(ingredients).toEqual([{ name: 'Jackfruit', amount: '200 g' }]);

        const steps = await viewPage.getSteps();
        expect(steps).toEqual(['Foo Bar Step']);
    });

    it('should delete a recipe', async () => {
        await profileHelper.apply('test-recipe');

        await overviewPage.open();
        await overviewPage.waitForRecipes();
        await overviewPage.viewRecipe({
            title: 'Test'
        });

        await viewPage.triggerAction('Löschen');
        await viewPage.approveDelete();

        const recipeCount = await overviewPage.getRecipeCount();
        expect(recipeCount).toBe(0);
    });

    it('should search through recipes', async () => {
        await profileHelper.apply('test-recipes');

        await overviewPage.open();
        await overviewPage.waitForRecipes();
        let recipeCount = await overviewPage.getRecipeCount();
        expect(recipeCount).toBe(2);

        await overviewPage.searchRecipes('Test');
        await browser.waitForNavigation();

        recipeCount = await overviewPage.getRecipeCount();
        expect(recipeCount).toBe(1);
    });

    it('should edit a recipe', async () => {
        await profileHelper.apply('test-recipe');

        await overviewPage.open();
        await overviewPage.waitForRecipes();
        await overviewPage.viewRecipe({
            title: 'Test'
        });

        await viewPage.triggerAction('Bearbeiten');

        await updatePage.enterName('Foo Bar Name');
        await updatePage.enterDescription('Foo Bar Description');
        await updatePage.enterPortions('42');

        await updatePage.changeTab('Arbeitsschritte');
        await updatePage.enterStep(0, 'Foo Bar Step');

        await updatePage.changeTab('Zutaten');
        await updatePage.enterIngredient('Test 2', '100', 'g');
        await updatePage.removeIngredient('Test');

        await updatePage.save();

        await browser.waitForNavigation();
        await overviewPage.hasMessage('Rezept wurde erfolgreich geändert!');

        const titleText = await viewPage.getTitle();
        expect(titleText).toBe('Foo Bar Name');

        const descriptionText = await viewPage.getDescription();
        expect(descriptionText).toBe('Foo Bar Description');

        const portions = await viewPage.getPortions();
        expect(portions).toBe(42);

        const ingredients = await viewPage.getIngredients();
        expect(ingredients).toEqual([{ name: 'Test 2', amount: '100 g' }]);

        const steps = await viewPage.getSteps();
        expect(steps).toEqual(['Foo Bar Step']);
    });
});
