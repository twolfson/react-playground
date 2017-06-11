// Define our Webpack config
module.exports = {
  entry: ['./browser/js/posts-container.jsx'],
  output: {
    path: __dirname + '/browser-dist/js',
    // https://webpack.js.org/configuration/output/#output-filename
    filename: 'posts-container.js'
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
