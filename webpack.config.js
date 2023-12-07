const path = require('path');

module.exports = {
    entry: {
        main: ['./app.js'],
        home: ['./handlers/home.js'],
        login: ['./handlers/login.js']
    },
    output: {
        filename: '[name].js',
        path: path.resolve(__dirname, 'public/dist'),
    },
    target: 'node',
};