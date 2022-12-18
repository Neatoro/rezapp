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

    async getRecipeCount() {
        return await this.browser.evaluate(() => {
            return document.querySelectorAll('div:has(> h5)').length;
        });
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
        await this.browser.clickButton('Neues Rezept', 'a');
    }

    async hasMessage(message) {
        await this.browser.waitForSelector('div[role="alert"]');
        const text = await this.browser.getInnerText(
            'div[role="alert"] div.text-sm'
        );

        return text === message;
    }
};
