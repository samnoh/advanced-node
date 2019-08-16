// Dependencies
require('dotenv').config();
require('module-alias/register');
const express = require('express');
const mongoose = require('mongoose');
const morgan = require('morgan');
const cookieSession = require('cookie-session');
const passport = require('passport');
const bodyParser = require('body-parser');
const { mongoURI, cookieKey } = require('@config/keys');
const path = require('path');

const prod = process.env.NODE_ENV === 'production';

// DB and Passport
require('@models/User');
require('@models/Blog');
require('@services/passport');
require('@services/cache');

// Routes
const setupAuthRoutes = require('@routes/authRoutes');
const setupBlogRoutes = require('@routes/blogRoutes');

// Server and DB Settings
const PORT = process.env.PORT;
mongoose.Promise = global.Promise;
mongoose.connect(mongoURI, { useNewUrlParser: true, dbName: 'advanced-node' });
const app = express();

// Server middleware
if (prod) {
    app.use(morgan('combined'));
} else {
    mongoose.set('debug', true);
    app.use(morgan('tiny'));
}

app.use(bodyParser.json());
app.use(
    cookieSession({
        maxAge: 14 * 24 * 60 * 60 * 1000,
        keys: [cookieKey],
        secure: prod
    })
);
app.use(passport.initialize());
app.use(passport.session());

// Server Routes
setupAuthRoutes(app);
setupBlogRoutes(app);

if (prod) {
    app.use(express.static('client/build'), {
        index: false
    });
    app.get('*', (req, res) => res.sendFile(path.resolve('client', 'build', 'index.html')));
}

// Start Server
app.listen(PORT, () => console.log(`Listening on port`, PORT));
