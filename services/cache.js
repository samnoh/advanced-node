const Promise = require('bluebird');
const { Query } = require('mongoose');
const { redisUrl } = require('@config/keys');
const redis = require('redis');

const exec = Query.prototype.exec;

Promise.promisifyAll(redis.RedisClient.prototype);
Promise.promisifyAll(redis.Multi.prototype);

const client = redis.createClient(redisUrl);

Query.prototype.cache = function(options = {}) {
    this.useCache = true;
    this.hashKey = JSON.stringify(options.key || 'default');

    return this;
};

Query.prototype.exec = async function() {
    if (!this.useCache) {
        return await exec.apply(this, arguments);
    }

    const key = JSON.stringify({ ...this.getQuery(), collection: this.mongooseCollection.name });

    const cacheValue = await client.hgetAsync(this.hashKey, key);

    if (cacheValue) {
        const doc = JSON.parse(cacheValue);
        // hydrate; convert json to MongoDB model
        return Array.isArray(doc) ? doc.map(d => new this.model(d)) : new this.model(doc);
    }

    const result = await exec.apply(this, arguments);

    client.hset(this.hashKey, key, JSON.stringify(result), 'EX', 10);

    return result;
};

module.exports = {
    clearHash(hashKey) {
        client.del(JSON.stringify(hashKey));
    },
    clearAllHashes() {
        client.flushall();
    }
};
