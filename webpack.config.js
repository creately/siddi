const path = require('path');

console.log( __dirname );

module.exports = [
  // Browser bundle
  {
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
  },
  // Node bundle
  {
    mode: 'production',
    entry: './src/siddi.ts',
    output: {
      path: path.resolve(__dirname, 'dist'),
      filename: 'siddi.node.js',
      library: {
        type: 'commonjs2'
      }
    },
    resolve: {
      extensions: ['.ts', '.js']
    },
    module: {
      rules: [
        { test: /\.ts$/, use: 'ts-loader' }
      ]
    },
    target: 'node'
  }
];