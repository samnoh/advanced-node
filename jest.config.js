require('dotenv').config();

module.exports = {
    verbose: true,
    testEnvironment: 'node',
    setupFilesAfterEnv: ['./tests/setup.js']
};
