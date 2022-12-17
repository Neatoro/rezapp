module.exports = class OverviewPage {
    constructor(browser) {
        this.browser = browser;
    }

    async open() {
        await this.browser.goto('/');
    }

    async getHeaderText() {
        return await this.browser.getInnerText('nav span');
    }

    async waitForRecipes() {
        await this.browser.waitForSelector('div:has(> h5)');
    }

    async viewRecipe({ title }) {
        await this.browser.evaluate((title) => {
            const recipe = [
                ...document.querySelectorAll('div:has(> h5)')
            ].filter((recipe) => {
                const titleElement = recipe.querySelector('h5');
                return titleElement.innerText === title;
            })[0];

            recipe.querySelector('a').click();
        }, title);
    }

    async newRecipe() {
        await this.browser.click('a[href="/create"]');
    }
};
