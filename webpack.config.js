// Disable ES5 lint warnings
/* eslint-disable no-restricted-globals,global-require */

// Define our webpack config
let jsLoaders;
module.exports = {
  entry: [__dirname + '/browser/js/posts.jsx'],
  output: {
    path: __dirname + '/browser-dist/js',
    filename: 'posts.js'
  },
  module: {
    rules: [
      {test: /(\.js|\.jsx)$/, use: jsLoaders = ['babel-loader']}
    ]
  },
  plugins: []
};

// If we are in development, then enable LiveReload
// TODO: Explore switching to React hot loader
// https://github.com/statianzo/webpack-livereload-plugin/tree/v0.11.0
if (process.env.ENV === 'development') {
  module.exports.entry.unshift('react-hot-loader/patch');
  jsLoaders.unshift('react-hot-loader/webpack');
  // const LiveReloadPlugin = require('webpack-livereload-plugin');
  // module.exports.plugins.push(new LiveReloadPlugin());
}
