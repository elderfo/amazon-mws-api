var webpack = require("webpack");
var path = require("path");

var GLOBALS = {
  'process.env.NODE_ENV': JSON.stringify('production')
};

module.exports = {
  devtool: 'source-map',
  entry: path.resolve(__dirname, 'index'),
  target: 'node',
  output: {
    path: __dirname + '/dist/', // Note: Physical files are only output by the production build task `npm run build`.
    filename: 'prod.js'
  },
  plugins: [
    new webpack.DefinePlugin(GLOBALS),
  ],
  module: {
    loaders: [
      { test: /\.(js|jsx)$/, loader: 'babel-loader' },
      { test: /\.(json)$/, loader: 'json-loader' },
    ]
  }
};
