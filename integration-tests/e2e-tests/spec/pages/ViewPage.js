module.exports = class ViewPage {
    constructor(browser) {
        this.browser = browser;
    }

    async getTitle() {
        return await this.browser.getInnerText('main h1');
    }

    async getDescription() {
        return await this.browser.getInnerText('main h1 + p');
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
};
