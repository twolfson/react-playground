// Define our Webpack config
module.exports = {
  // `entry` and `output` managed by `webpack-stream` in `gulpfile.js`
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
