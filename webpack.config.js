// Load in our dependencies
const _ = require('underscore');

const {getConfig} = require('./config');

// Define our Webpack config
const config = getConfig();
module.exports = {
  entry: ['./browser/js/posts-container.jsx'],
  output: {
    path: __dirname + '/browser-dist/js',
    // https://webpack.js.org/configuration/output/#output-filename
    filename: 'posts-container.js',
    // DEV: We must specify `publicPath` for consistent support via HMR
    // publicPath: http://localhost:5000/browser-dist/js/
    publicPath: url.format(_.defaults({
      pathname: '/browser-dist/js/'
    }, config.url.external))
  },
  resolve: {
    extensions: ['.js', '.json', '.jsx']
  },
  module: {
    rules: [
      {
        test: /(\.js|\.jsx)$/,
        exclude: /node_modules/,
        use: ['babel-loader']
      }
    ]
  },
  plugins: []
};

// If we are in development, then enable LiveReload
// https://github.com/statianzo/webpack-livereload-plugin/tree/v0.11.0
if (process.env.ENV === 'development') {
  /* eslint-disable global-require */
  const LiveReloadPlugin = require('webpack-livereload-plugin');
  /* eslint-enable global-require */
  module.exports.plugins.push(new LiveReloadPlugin());
}
