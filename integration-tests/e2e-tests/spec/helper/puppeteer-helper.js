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

    async evaluate(evaluateFunction) {
        const result = await this.page.evaluate(evaluateFunction);
        return result;
    }

    async click(selector) {
        await this.page.click(selector);
    }

    async close() {
        await this.page.close();
    }
};
