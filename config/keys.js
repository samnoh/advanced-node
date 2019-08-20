/**
 * @file
 * This file will
 * - In Production: Pull the keys values out of envs as used by Heroku envs.
 * - In Development: Pull the keys values defined in the .env root of the project for development.
 */

module.exports = {
    prod: process.env.NODE_ENV === 'production',
    ci: process.env.NODE_ENV === 'ci',
    port: process.env.PORT || 5000,
    cookieKey: process.env.COOKIE_KEY,
    googleClientID: process.env.GOOGLE_CLIENT_ID,
    googleClientSecret: process.env.GOOGLE_CLIENT_SECRET,
    mongoURI: process.env.MONGODB_URI,
    redisUrl: process.env.REDIS_URL,
    accessKeyId: process.env.ACCESS_KEY_ID,
    secretAccessKey: process.env.SECRET_ACCESS_KEY
};
