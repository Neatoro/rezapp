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

    async enterPortions(portions) {
        await this.browser.type('#recipe-portions', portions);
    }

    async changeTab(tab) {
        await this.browser.clickButton(tab);
    }

    async addLabel(text) {
        const id = await this.browser.evaluate((text) => {
            const option = [
                ...document.querySelectorAll('#labelSelect option')
            ].find((option) => option.innerText === text);
            return option.value;
        }, text);

        await this.browser.select('#labelSelect', id);
        await this.browser.clickButton('Hinzufügen');
    }

    async removeLabel(text) {
        await this.browser.evaluate((text) => {
            const labelElement = [
                ...document.querySelectorAll('.labels span')
            ].find((label) => label.innerText === `${text}\nX`);
            labelElement.querySelector('button').click();
        }, text);
    }

    async enterStep(index, description) {
        await this.browser.type(`#step-description-${index}`, description);
    }

    async openCreateLabelModal() {
        await this.browser.clickButton('Neue Kategorie erstellen');

        await this.browser.waitForSelector('#modalCreateLabel');
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

    async createLabel(name, color) {
        await this.browser.type('#modalCreateLabel #name', name);
        await this.browser.select('#modalCreateLabel #color', color);
        await this.browser.clickButton('Erstellen');
        await this.browser.waitForSelector('#modalCreateIngredient', {
            hidden: true
        });
    }

    async hasLabel(name) {
        return await this.browser.evaluate((name) => {
            return [...document.querySelectorAll('#labelSelect option')]
                .map((option) => option.innerText)
                .includes(name);
        }, name);
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

    async getInputErrorText(selector) {
        await this.browser.waitForSelector(selector);
        return await this.browser.getInnerText(selector);
    }
};
