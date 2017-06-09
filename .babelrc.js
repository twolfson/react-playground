// .babelrc.js is supported as of Babel@7.x.x
//   and it solves redundancy issues for env
//   https://github.com/babel/babel/pull/4892
// Load in our dependencies
const assert = require('assert');

const _ = require('underscore');

// Define our configuration options
const env = process.env.NODE_ENV;
assert(env);
const enableHMR = false;
if (env === 'development') {
  enableHMR = true;
}

// Resolve our dependencies
module.exports = {
  presets: [
    enableHMR ? ['env', {modules: false}] : 'env',
    'react'
  ],
  plugins: _.flatten([
    enableHMR ? 'react-hot-loader/babel' : [],
    'transform-class-properties'
  ])
};
