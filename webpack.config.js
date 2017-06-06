// Disable ES5 lint warnings
/* eslint-disable no-restricted-globals,global-require */

// Define our webpack config
module.exports = {
  entry: __dirname + '/browser/js/posts.js',
  output: {
    path: __dirname + '/browser-dist/js',
    filename: 'posts.js'
  },
  plugins: []
};

// If we are in development, then enable LiveReload
// TODO: Explore switching to React hot loader
// https://github.com/statianzo/webpack-livereload-plugin/tree/v0.11.0
if (process.env.ENV === 'development') {
  const LiveReloadPlugin = require('webpack-livereload-plugin');
  module.exports.plugins.push(new LiveReloadPlugin());
}
