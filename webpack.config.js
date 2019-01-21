const path = require('path');

console.log( __dirname );

module.exports = {
    mode: 'production',
    entry: {
        bundle: './src/bundle.ts',
        index: './src/index.ts',
    },
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: '[name].js'
    },
    resolve: {
        extensions: [ '.ts', '.js' ]
    },
    module: {
        rules: [
            { test: /\.ts$/, use: 'ts-loader' },
        ]
    }
};