module.exports = class CreatePage {
    constructor(browser) {
        this.browser = browser;
    }

    async enterName(name) {
        await this.browser.type('#recipe-name', name);
    }

    async enterDescription(description) {
        await this.browser.type('#description', description);
    }

    async changeTab(tab) {
        await this.browser.clickButton(tab);
    }

    async enterStep(index, description) {
        await this.browser.type(`#step-description-${index}`, description);
    }

    async openIngredientModal() {
        await this.browser.waitForSelector('table');
        await this.browser.clickButton('Hinzufügen');

        await this.browser.waitForSelector('#modalAddIngredient');
    }

    async openCreateIngredientModal() {
        await this.browser.clickButton('Neue Zutat erstellen');

        await this.browser.waitForSelector('#modalCreateIngredient');
    }

    async createIngredient(name) {
        await this.browser.type('#modalCreateIngredient #name', name);
        await this.browser.clickButton('Erstellen');
        await this.browser.waitForSelector('#modalCreateIngredient', {
            hidden: true
        });
    }

    async hasIngredient(name) {
        await this.browser.page.waitForFunction(
            'document.querySelector("#modalAddIngredient tbody").innerText.trim() !== ""'
        );

        return await this.browser.evaluate((name) => {
            const ingredient = [
                ...document.querySelectorAll('#modal tbody tr')
            ].filter((row) => {
                const cells = row.querySelectorAll('td');
                const ingredientName = cells[1].innerText;
                return ingredientName === name;
            });
            return ingredient.length === 1;
        }, name);
    }

    async enterIngredient(name, amount, unit) {
        await this.openIngredientModal();

        await this.browser.evaluate((name) => {
            const ingredient = [
                ...document.querySelectorAll('#modal tbody tr')
            ].filter((row) => {
                const cells = row.querySelectorAll('td');
                const ingredientName = cells[1].innerText;
                return ingredientName === name;
            })[0];
            ingredient.querySelector('td > input[type="checkbox"]').click();
        }, name);

        await this.browser.waitForSelector('input[type="checkbox"]:checked');
        await this.browser.clickButton('Auswählen');

        await this.browser.type(`input[data-name="amount-${name}"]`, amount);
        await this.browser.type(`input[data-name="unit-${name}"]`, unit);
    }

    async removeIngredient(name) {
        await this.browser.waitForSelector('tbody tr');

        await this.browser.evaluate((name) => {
            const ingredient = [
                ...document.querySelectorAll('tbody tr')
            ].filter((row) => {
                const cells = row.querySelectorAll('td');
                const ingredientName = cells[2].innerText;
                return ingredientName === name;
            })[0];
            ingredient.querySelector('button').click();
        }, name);
    }

    async save() {
        await this.browser.clickButton('Speichern');
    }

    async hasErrorMessage(message) {
        await this.browser.waitForSelector('div[role="alert"]');
        const text = await this.browser.getInnerText(
            'div[role="alert"] div.text-sm'
        );

        return text === message;
    }
};
