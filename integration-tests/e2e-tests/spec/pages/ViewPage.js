module.exports = class ViewPage {
    constructor(browser) {
        this.browser = browser;
    }

    async getTitle() {
        return await this.browser.getInnerText('main h1');
    }

    async getDescription() {
        return await this.browser.getInnerText('main h1 ~ p');
    }

    async getPortions() {
        const portions = await this.browser.evaluate(() => {
            return document.querySelector('#portionInput').value;
        });
        return Number(portions);
    }

    async setPortions(portions) {
        await this.browser.clearInput('#portionInput');
        await this.browser.type('#portionInput', portions);
    }

    async getIngredients() {
        return await this.browser.evaluate(() => {
            const ingredientSection =
                document.querySelectorAll('main section')[0];
            const ingredients = [
                ...ingredientSection.querySelectorAll('tbody tr')
            ].map((row) => {
                const cells = row.querySelectorAll('td');
                const amount = cells[0].innerText;
                const name = cells[1].innerText;

                return { amount, name };
            });
            return ingredients;
        });
    }

    async getSteps() {
        return await this.browser.evaluate(() => {
            const stepSection = document.querySelectorAll('main section')[1];
            const steps = [...stepSection.querySelectorAll('p')].map(
                (element) => element.innerText
            );
            return steps;
        });
    }

    async triggerAction(action) {
        await this.browser.waitForSelector('button[name="Open actions menu"]');
        await this.browser.click('button[name="Open actions menu"]');

        await this.browser.waitForSelector('div[role="tooltip"]');
        await this.browser.clickButton(action);
    }

    async approveDelete() {
        await this.browser.waitForSelector('#modalDeleteRecipe');
        await this.browser.clickButton('Löschen');
    }

    async getLabels() {
        return await this.browser.evaluate(() => {
            const labelElements = document.querySelectorAll('.labels span');
            return [...labelElements].map((element) => element.innerText);
        });
    }
};
