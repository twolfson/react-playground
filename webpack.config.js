// Define our webpack config
module.exports = {
  entry: __dirname + '/browser/js/posts.js',
  output: {
    path: __dirname + '/browser-dist/js',
    filename: 'posts.js'
  }
};
