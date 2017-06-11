// Load in our dependencies
const gulp = require('gulp');
const gulpNotify = require('gulp-notify');
const gulpLivereload = require('gulp-livereload');
const rimraf = require('rimraf');
const webpack = require('webpack');
const webpackStream = require('webpack-stream');

// Set up our configuration
let config = {
  allowFailures: false,
  watchFiles: false
};
if (process.env.ENV === 'development') {
  config.allowFailures = true;
  config.watchFiles = true;
}

// Define our build tasks
gulp.task('build-clean', function clean (done) {
  // Remove all compiled files in `browser-dist/`
  rimraf(__dirname + '/browser-dist/', done);
});

gulp.task('build-css', function buildJs () {
  return gulp.src(['/browser/css/*.css'])
    .pipe(gulp.dest('browser-dist/css'))
    .pipe(gulpLivereload());
});

gulp.task('build-js', function buildJs () {
  // Bundle Webpack content
  let jsStream = gulp.src('browser/js/posts-container.jsx')
    .pipe(webpackStream({
      watch: config.watchFiles,
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
      }
    }, webpack));

  // If we are allowing failures, then log them
  if (config.allowFailures) {
    jsStream.on('error', gulpNotify.onError());
  }

  // Return our stream
  return jsStream
    .pipe(gulp.dest('browser-dist/js'))
    .pipe(gulpLivereload());
});

gulp.task('build', ['build-css', 'build-js']);

// Define our development tasks
gulp.task('livereload-update', function livereloadUpdate () {
  gulpLivereload.reload();
});

// DEV: `['build']` requires that our build task runs once
gulp.task('develop', ['build'], function develop () {
  // Start a livereload server
  gulpLivereload.listen();

  // When one of our src files changes, re-run its corresponding task
  gulp.watch(['server/**/*'], ['livereload-update']);
  gulp.watch(['browser/css/**/*'], ['build-css']);
});
