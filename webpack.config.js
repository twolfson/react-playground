// Disable ES5 lint warnings
/* eslint-disable no-restricted-globals,global-require */

// Load in our dependencies
const assert = require('assert');
const fs = require('fs');
const url = require('url');

const _ = require('underscore');
const webpack = require('webpack');

const {getConfig} = require('./config');

// Define our Webpack config
const config = getConfig();
let babelConfig = JSON.parse(fs.readFileSync(__dirname + '/.babelrc', 'utf8'));
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
        use: [{
          loader: 'babel-loader',
          // DEV: We use `babelConfig` so it can be extended for HMR
          // options: babelConfig
        }, 'react-hot-loader/webpack']
      }
    ]
  },
  plugins: []
};

// If we are in development, then enable hot module replacement (HMR)
// DEV: We found this worked via trial/error/snooping in `react-hot-boilerplate#next`
//   https://github.com/gaearon/react-hot-boilerplate/blob/530fb8fee703e52eeeed894301af3d46d266cae9/webpack.config.js
//   If something breaks, we recommend ditching the server and switching to `serve .` temporarily
//   Then compare between the boilerplate and the code -- it should be an `index.html`, `index.js`, and `app.js`
if (process.env.ENV === 'development') {
  module.exports.entry.unshift('react-hot-loader/patch');
  // http://localhost:5000/browser-dist/js/ -> http://localhost:35730/browser-dist/js/
  module.exports.output.publicPath = module.exports.output.publicPath.replace(
    url.format(config.url.internal), url.format(config.webpackDevServerUrl));
  module.exports.plugins.push(new webpack.HotModuleReplacementPlugin());
  module.exports.plugins.push(new webpack.NamedModulesPlugin());
  module.exports.plugins.push(new webpack.NoEmitOnErrorsPlugin());
  assert(babelConfig.presets.includes('env'));
  babelConfig.presets = babelConfig.presets.map(function removeModulesFromEnv (preset) {
    if (preset === 'env') {
      return ['env', {modules: false}];
    } else {
      return preset;
    }
  });
  console.log('wtfff', babelConfig);
  module.exports.devServer = {
    host: config.webpackDevServerUrl.hostname,
    port: config.webpackDevServerUrl.port,
    hot: true,
    headers: {
      // TODO: Restrict origin
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, PATCH, OPTIONS',
      'Access-Control-Allow-Headers': 'X-Requested-With, content-type, Authorization'
    }
  };
}
