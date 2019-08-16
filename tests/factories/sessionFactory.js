require('dotenv').config();
const { cookieKey } = require('../../config/keys');
const Buffer = require('safe-buffer').Buffer;
const Keygrip = require('keygrip');

const keygrip = new Keygrip([cookieKey]);

module.exports = user => {
    const sessionObject = { passport: { user: user._id.toString() } };

    const session = Buffer.from(JSON.stringify(sessionObject)).toString('base64');
    const sig = keygrip.sign('express:sess=' + sessionString);

    return { session, sig };
};
