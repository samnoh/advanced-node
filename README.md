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

-   `del()`

```javascript
client.del('color');
client.get('color', console.log); // null null
```

-   Usage

```javascript
router.get('/blogs', async (req, res) => {
    const cachedBlogs = await client.getAsync(req.user.id);

    if (cachedBlogs) {
        return res.send(JSON.parse(cachedBlogs));
    }

    const blogs = await Blog.find({ _user: req.user.id });
    res.send(blogs);
});
```

### Async Middleware

-   Execute something after next()

```javascript
const middleware = async (req, res, next) => {
    await next();

    doSomething();
};
```
