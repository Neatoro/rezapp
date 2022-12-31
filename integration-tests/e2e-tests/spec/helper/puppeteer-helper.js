const puppeteer = require('puppeteer');

module.exports = class PuppeteerHelper {
    async setupBrowser() {
        this.browser = await puppeteer.launch({
            args: ['--no-sandbox'],
            headless: false
        });
    }

    async setupPage() {
        this.page = await this.browser.newPage();
    }

    async goto(path) {
        const baseUrl =
            process.env.FRONTEND_BASE_URL || 'http://localhost:5173';
        await this.page.goto(`${baseUrl}${path}`);
    }

    async getInnerText(selector) {
        await this.page.waitForSelector(selector);

        const result = await this.page.evaluate((selector) => {
            return document.querySelector(selector).innerText;
        }, selector);

        return result;
    }

    async evaluate(evaluateFunction, ...params) {
        const result = await this.page.evaluate(evaluateFunction, ...params);
        return result;
    }

    async click(selector) {
        await this.page.waitForSelector(selector, { visible: true });
        await this.page.click(selector);
    }

    async clickButton(text, element = 'button') {
        await this.page.waitForXPath(`//${element}[contains(., '${text}')]`);

        await this.page.evaluate(
            (text, element) => {
                const button = [...document.querySelectorAll(element)].filter(
                    (button) => button.innerText === text
                )[0];
                button.click();
            },
            text,
            element
        );
    }

    async type(selector, text) {
        await this.page.waitForSelector(selector, { visible: true });
        await this.page.type(selector, text, { delay: 100 });
    }

    async clearInput(selector) {
        await this.page.waitForSelector(selector, { visible: true });

        const input = await this.page.$(selector);
        await input.click({ clickCount: 3 });
        await input.press('Backspace');
    }

    async waitForSelector(selector, options) {
        await this.page.waitForSelector(selector, options);
    }

    async waitForNavigation(options) {
        await this.page.waitForNavigation(options);
    }

    async close() {
        await this.page.close();
    }

    async tearDown() {
        await this.browser.close();
    }
};
