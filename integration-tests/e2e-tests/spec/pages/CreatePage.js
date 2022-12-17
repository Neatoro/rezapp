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
        await this.browser.evaluate((tab) => {
            [...document.querySelectorAll('button[role="tab"]')].filter((button) => button.innerText === tab)[0].click();
        }, tab);
    }

    async enterStep(index, description) {
        await this.browser.type(`#step-description-${index}`, description);
    }

    async enterIngredient(name, amount, unit) {
        await this.browser.clickButton('Hinzufügen')

        await this.browser.waitForSelector('#modal');

        await this.browser.evaluate((name) => {
            const ingredient = [...document.querySelectorAll('#modal tbody tr')].filter((row) => {
                const cells = row.querySelectorAll('td');
                const ingredientName = cells[1].innerText;
                return ingredientName === name;
            })[0];
            ingredient.querySelector('td > input[type="checkbox"]').click();
        }, name);

        await this.browser.waitForSelector('input[type="checkbox"]:checked');
        await this.browser.clickButton('Auswählen');

        await this.browser.type('#amount-' + name, amount);
        await this.browser.type('#unit-' + name, unit);
    }

    async save() {
        await this.browser.evaluate(() => {
            const saveButton = [...document.querySelectorAll('button')].filter((button) => button.innerText === 'Speichern')[0];
            saveButton.click();
        });
    }
};


