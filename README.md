# Advanced Node Production

## `TIL`

### bluebird

-   A full featured promise library
-   [npm](https://www.npmjs.com/package/bluebird)

-   Install

```bash
npm install --save bluebird
```

-   Usage

```javascript
const Promise = require("bluebird");
const fs = require("fs");
Promise.promisifyAll(fs);
fs.readFileAsync("file.js", "utf8").then(...)
```

### Redis

-   [npm](https://www.npmjs.com/package/redis)

-   Setup

```javascript
import redis from 'redis';

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
import { promisify } from 'util';

client.get = util.promisify(client.get);

app.get('/blogs', async (req, res) => {
    const cachedBlogs = await client.get(req.user.id);

    if (cachedBlogs) {
        return res.send(JSON.parse(cachedBlogs));
    }

    const blogs = await Blog.find({ _user: req.user.id });
    res.send(blogs);
});
```
