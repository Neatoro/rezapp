const CreatePage = require('./CreatePage');

module.exports = class UpdatePage extends CreatePage {
    constructor(browser) {
        super(browser);
    }

    async enterName(name) {
        await this.browser.clearInput('#recipe-name');
        await super.enterName(name);
    }

    async enterDescription(description) {
        await this.browser.clearInput('#description');
        await super.enterDescription(description);
    }

    async enterStep(index, description) {
        await this.browser.clearInput(`#step-description-${index}`);
        await super.enterStep(index, description);
    }
};
