// Disable ES5 lint warnings
/* eslint-disable no-restricted-globals,global-require */

// Load in our dependencies
const url = require('url');

const _ = require('underscore');
const webpack = require('webpack');

const {getConfig} = require('./config');

// Define our Webpack config
const config = getConfig();
module.exports = {
  entry: [__dirname + '/browser/js/posts.jsx'],
  output: {
    path: __dirname + '/browser-dist/js',
    filename: 'posts.js',
    // DEV: We must specify `publicPath` for consistent support via HMR
    // publicPath: http://localhost:5000/browser-dist/js/
    publicPath: url.format(_.defaults({
      path: '/browser-dist/js/'
    }, config.url.external))
  },
  module: {
    rules: [
      {test: /(\.js|\.jsx)$/, use: ['babel-loader'], exclude: /node_modules/}
    ]
  },
  plugins: []
};

// If we are in development, then enable hot module replacement (HMR)
// DEV: We found this worked via trial/error/snooping in `react-hot-boilerplate`
if (process.env.ENV === 'development') {
  module.exports.entry.unshift('react-hot-loader/patch');
  // http://localhost:5000/browser-dist/js/ -> http://localhost:35730/browser-dist/js/
  module.exports.output.publicPath = module.exports.output.publicPath.replace(
    url.format(config.url.internal), url.format(config.webpackDevServerUrl));
  module.exports.plugins.push(new webpack.HotModuleReplacementPlugin());
  module.exports.devServer = {
    host: config.webpackDevServerUrl.hostname,
    port: config.webpackDevServerUrl.port,
    hot: true
  };
}
