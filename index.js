// Dependencies
require('dotenv').config();
require('module-alias/register');
const express = require('express');
const mongoose = require('mongoose');
const morgan = require('morgan');
const cookieSession = require('cookie-session');
const passport = require('passport');
const bodyParser = require('body-parser');
const { mongoURI, cookieKey, prod, ci, port } = require('@config/keys');
const path = require('path');

// DB and Passport
require('@models/User');
require('@models/Blog');
require('@services/passport');
require('@services/cache');

// Routes
const setupAuthRoutes = require('@routes/authRoutes');
const setupBlogRoutes = require('@routes/blogRoutes');
const setupUploadRoutes = require('@routes/uploadRoutes');

// Server and DB Settings
mongoose.Promise = global.Promise;
mongoose.connect(mongoURI, { useNewUrlParser: true, dbName: 'advanced-node' });
const app = express();

// Server middleware
if (prod) {
    app.use(morgan('combined'));
} else if (!ci) {
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
setupUploadRoutes(app);

if (prod || ci) {
    app.use(express.static('client/build'));
    app.get('*', (req, res) => res.sendFile(path.resolve('client', 'build', 'index.html')));
}

// Start Server
app.listen(port, () => console.log(`Listening on port`, port));
