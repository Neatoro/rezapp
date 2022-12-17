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
};
