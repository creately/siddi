const path = require('path');
const webpack = require('webpack');

module.exports = {
    entry: './src/siddi.ts',
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: 'siddi.js'
    },
    resolve: {
        extensions: [ '.ts', '.js' ]
    },
    plugins: [
        new webpack.SourceMapDevToolPlugin({ filename: "[file].map" }),
    ],
    module: {
        rules: [
            { test: /\.ts$/, use: 'ts-loader' },
        ]
    }
};