const puppeteer = require('puppeteer');

const sessionFactor = require('../factories/sessionFactory');
const userFactory = require('../factories/userFactory');

class CustomPage {
    static async build() {
        const browser = await puppeteer.launch({
            headless: true,
            arg: ['--no-sandbox']
        });
        const page = await browser.newPage();
        const customPage = new CustomPage(page);

        return new Proxy(customPage, {
            get: function(target, property) {
                return target[property] || browser[property] || page[property];
            }
        });
    }

    constructor(page) {
        this.page = page;
    }

    async login() {
        const user = await userFactory();
        const { session, sig } = sessionFactor(user);

        await this.page.setCookie({ name: 'express:sess', value: session });
        await this.page.setCookie({ name: 'express:sess.sig', value: sig });
        await this.page.goto('http://localhost:3000/blogs');
        await this.page.waitFor('a[href="/auth/logout"]');
    }

    getContentsOf(selector) {
        return this.page.$eval(selector, el => el.innerHTML);
    }

    get(path) {
        return this.page.evaluate(
            _path =>
                fetch(_path, {
                    method: 'GET',
                    credentials: 'same-origin',
                    headers: {
                        'Content-Type': 'application/json'
                    }
                }).then(res => res.json()),
            path
        );
    }

    post(path, data) {
        return this.page.evaluate(
            (_path, _data) =>
                fetch(_path, {
                    method: 'POST',
                    credentials: 'same-origin',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(_data)
                }).then(res => res.json()),
            path,
            data
        );
    }

    execRequests(actions) {
        return Promise.all(
            actions.map(({ method, path, data }) => {
                return this[method](path, data); // this.get(path) or this.post(path, data);
            })
        );
    }
}

module.exports = CustomPage;
