const Page = require('./helpers/page');

let page;

beforeEach(async () => {
    page = await Page.build();
    await page.goto('http://localhost:3000');
});

afterEach(async () => {
    await page.close();
});

describe('When logged in', () => {
    beforeEach(async () => {
        await page.login();
        await page.click('a[href="/blogs/new"]');
    });

    test('can see blog create form', async () => {
        const label = await page.getContentsOf('form .title label');

        expect(label).toEqual('Blog Title');
    });

    describe('And using valid inputs', () => {
        beforeEach(async () => {
            await page.type('.title input', 'My Title');
            await page.type('.content input', 'My Content');
            await page.click('button[type="submit"]');
        });

        test('Submitting tasks user to review screen', async () => {
            const text = await page.getContentsOf('h5');

            expect(text).toEqual('Please confirm your entries');
        });

        test('Submitting then saving adds blog to index page', async () => {
            await page.click('button.green'); // 'SAVE BLOG' button
            await page.waitFor('.card');

            const title = await page.getContentsOf('.card-title');
            const content = await page.getContentsOf('p');

            expect(title).toEqual('My Title');
            expect(content).toEqual('My Content');
        });
    });

    describe('And using invalid inputs', () => {
        beforeEach(async () => {
            await page.click('button[type="submit"]');
        });

        test('the form shows an error message', async () => {
            const titleError = await page.getContentsOf('.title .red-text');
            const contentError = await page.getContentsOf('.content .red-text');

            expect(titleError).toEqual('You must provide a value');
            expect(contentError).toEqual('You must provide a value');
        });
    });
});

describe('When User is not logged in', () => {
    const actions = [
        {
            method: 'get',
            path: '/api/blogs'
        },
        {
            method: 'post',
            path: '/api/blogs',
            data: {
                title: 'T',
                content: 'C'
            }
        }
    ];

    test('Blog related actions are prohibited', async () => {
        const results = await page.execRequests(actions);

        results.map(result => {
            expect(result).toEqual({ error: 'Login required' });
        });
    });
});
