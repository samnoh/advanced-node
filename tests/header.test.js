const puppeteer = require('puppeteer');
const sessionFactor = require('./factories/sessionFactory');

let browser, page;

beforeEach(async () => {
    browser = await puppeteer.launch({ headless: true });

    page = await browser.newPage();
    await page.goto('http://localhost:3000');
});

afterEach(async () => {
    await browser.close();
});

test('The header has the correct text', async () => {
    const text = await page.$eval('a.brand-logo', el => el.innerHTML);

    expect(text).toEqual('Blogster');
});

test('Clicking login starts OAuth flow', async () => {
    await page.click('.right a');

    const url = await page.url();
    expect(url).toMatch(/accounts\.google\.com/);
});

test('When signed in, shows logout button', async () => {
    const { session, sig } = sessionFactor(id);

    await page.setCookie({
        name: 'express:sess',
        value: session
    });
    await page.setCookie({
        name: 'express:sess.sig',
        value: sig
    });
    await page.goto('http://localhost:3000');
    await page.waitFor('a[href="/auth/logout"]');

    const text = await page.$eval('a[href="/auth/logout"]', el => el.innerHTML);

    expect(text).toEqual('Logout');
});
