// Load in our dependencies
const webpack = require('webpack');

// Define our Webpack config
module.exports = {
  entry: ['./browser/js/posts-app-init.jsx'],
  output: {
    path: __dirname + '/browser-dist/js',
    // https://webpack.js.org/configuration/output/#output-filename
    filename: 'posts-app-init.js'
  },
  resolve: {
    extensions: ['.js', '.json', '.jsx']
  },
  module: {
    rules: [
      {
        test: /(\.js|\.jsx)($|\?)/,
        exclude: /node_modules/,
        use: ['babel-loader']
      }
    ]
  },
  plugins: [
    // Fix sourcemaps for Karma and still support Chrome
    //   Unable to get Firefox working =(
    //   https://github.com/webpack-contrib/karma-webpack/issues/109#issuecomment-224961264
    new webpack.SourceMapDevToolPlugin({
      test: /(\.js|\.jsx)($|\?)/
    })
  ]
};

// If we are in development, then enable LiveReload
// https://github.com/statianzo/webpack-livereload-plugin/tree/v0.11.0
if (process.env.ENV === 'development') {
  /* eslint-disable global-require */
  const LiveReloadPlugin = require('webpack-livereload-plugin');
  /* eslint-enable global-require */
  module.exports.plugins.push(new LiveReloadPlugin());
}
