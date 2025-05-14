const path = require('path');

module.exports = {
  mode: 'production',
  entry: './src/siddi.ts',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'siddi.browser.js',
    library: {
      name: 'Siddi',
      type: 'umd',
      export: 'default'
    },
    globalObject: 'this'
  },
  resolve: {
    extensions: ['.ts', '.js'],
    fallback: {
      "util": false,
      "querystring": false,
      "url": false
    }
  },
  module: {
    rules: [
      { test: /\.ts$/, use: 'ts-loader' }
    ]
  }
}; 