// Define our webpack config
// eslint-disable-next-line no-restricted-globals
module.exports = {
  entry: __dirname + '/browser/js/posts.js',
  output: {
    path: __dirname + '/browser-dist/js',
    filename: 'posts.js'
  }
};
