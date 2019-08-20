# Advanced Node

## `TIL`

### bluebird

-   A full featured promise library
-   [npm](https://www.npmjs.com/package/bluebird)

-   Install

```bash
npm install --save bluebird
```

-   Usage
    -   Automatically add 'Async'-suffix to method name

```javascript
const Promise = require("bluebird");
const fs = require("fs");
Promise.promisifyAll(fs);
fs.readFileAsync("file.js", "utf8").then(...)
```

### Redis

-   In-memory data structure
-   [npm](https://www.npmjs.com/package/redis)

-   Setup

```javascript
import * as Promise from 'bluebird';
import redis from 'redis';

Promise.promisifyAll(redis.RedisClient.prototype);
Promise.promisifyAll(redis.Multi.prototype);

const redisUrl = 'redis://127.0.0.1:6379';
const client = redis.createClient(redisUrl);
```

-   `get()` & `set()`

```javascript
client.set('color', 'red');
client.get('color', (err, val) => console.log(val)); // red
client.get('color', console.log); // null 'red'

client.set('color', 'red', 'EX', 5); // expires in 5 seconds
```

-   `hget()` & `hset()`

```javascript
client.hset('apple', 'iphone', '4s');
client.hget('apple', 'iphone', console.log); // null '4s'
```

-   `del()` & `flushall()`

```javascript
client.del('color');
client.get('color', console.log); // null null
client.flushall(); // remove all caches
```

-   Usage

```javascript
router.get('/blogs', async (req, res) => {
    const cachedBlogs = await client.getAsync(req.user.id); // getAsync(); not get()

    if (cachedBlogs) {
        return res.send(JSON.parse(cachedBlogs));
    }

    const blogs = await Blog.find({ _user: req.user.id });
    res.send(blogs);
});

router.post('/blogs', (req, res) => {
    const { title, body } = req.body;
    const blog = new Blog({ ... });

    await blog.save();

    client.del(req.user.id); // remove caches for the user

    res.redirect('/blogs');
});
```

### Async Middleware

-   Execute something after `next()`

```javascript
const middleware = async (req, res, next) => {
    await next();

    doSomething();
};
```

### Jest

-   JavaScript Testing
-   [Docs](https://jestjs.io/docs/en/getting-started://jestjs.io/)
-   [Cheat Sheet](https://github.com/sapegin/jest-cheat-sheet/blob/master/Readme.md)

-   `jest.config.js`

```javascript
module.exports = {
    testEnvironment: 'node',
    setupFilesAfterEnv: ['./tests/setup.js'] /* always execute those files before testing */
};
```

-   Test structure
    -   `describe()` and `test()`
    -   `beforeAll()`, `afterAll()`, `beforeEach()` and `afterEach()`

```javascript
describe('...', () => {
    beforeAll(() => {
        /* Runs before all tests */
    });
    afterAll(() => {
        /* Runs after all tests */
    });
    beforeEach(() => {
        /* Runs before each test */
    });
    afterEach(() => {
        /* Runs after each test */
    });

    test('...', () => { ... });
});
```

-   Usage

```javascript
test('object props', () => {
    const data = { one: 1, two: 2 };
    expect(data).toEqual({ one: 1, two: 2 });
});

test('the data is abc', async () => {
    const data = await fetchData();
    expect(data).toBe('abc');
});

test('mentions google', () => {
    expect(getBestWebsites()).toMatch(/google/);
});
```

-   Skip these tests

```javascript
describe.skip('...', () => { .. });
test.skip('...', () => { .. });
```

-   Run only these tests

```javascript
describe.only('...', () => { .. });
test.only('...', () => { .. });
```

### Puppeteer

-   Headless Chrome Node API
-   [GitHub](https://github.com/GoogleChrome/puppeteer)

-   Launch the headless Chromium

```javascript
browser = await puppeteer.launch({ headless: true });
```

-   Quit the app

```javascript
browser.close();
```

-   Create a new page (tab)

```javascript
page = await browser.newPage();
```

-   Goto the link

```javascript
page.goto('http://example.com');
```

-   Wait for loading the element

```javascript
page.waitFor('a.left');
```

-   Click button

```javascript
page.click('button.active');
```

-   Get HTML contents

```javascript
page.$eval('selector', el => el.innerHTML);
```

-   Set cookies

```javascript
page.setCookie({ name: 'session', value: '...' });
```

### Proxy

-   ES6
-   Define custom behavior for fundamental operations
-   Wrapper object

```javascript
class Car {
    goTo() {
        console.log('vrrr');
    }
}

class CustomCar {
    static build() {
        const car = new Car();
        const customCar = new CustomCar();

        return new Proxy(customCar, {
            get: function(target, handler) {
                return target[handler] || car[handler];
            }
        });
    }

    stop() {
        console.log('stop!');
    }
}

const car = CustomCar.build();
car.goTo();
car.stop();
```

### Travis CI

-   [Travis CI](https://travis-ci.com/)

-   `.travis.yml`

```yaml
language: node_js
node_js:
    - 12
dist: trusty
services:
    - mongodb
    - redis-server
env:
    - NODE_ENV=ci PORT=3000
cache:
    directories:
        - node_modules
install:
    - npm install
    - npm run build
    - nohup npm start &
    - sleep 5
```
