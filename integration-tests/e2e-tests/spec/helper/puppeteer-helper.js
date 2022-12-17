const puppeteer = require('puppeteer');

module.exports = class PuppeteerHelper {
    async setupPage() {
        const browser = await puppeteer.launch({
            args: ['--no-sandbox']
        });
        this.page = await browser.newPage();
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

    async clickButton(text) {
        await this.page.evaluate((text) => {
            const button = [...document.querySelectorAll('button')].filter(
                (button) => button.innerText === text
            )[0];
            button.click();
        }, text);
    }

    async type(selector, text) {
        await this.page.waitForSelector(selector, { visible: true });
        await this.page.type(selector, text, { delay: 100 });
    }

    async waitForSelector(selector) {
        await this.page.waitForSelector(selector);
    }

    async close() {
        await this.page.close();
    }
};
