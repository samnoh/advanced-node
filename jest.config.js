require('dotenv').config();

module.exports = {
    testEnvironment: 'node',
    setupFilesAfterEnv: ['./tests/setup.js']
};
