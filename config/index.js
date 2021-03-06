// Load in our dependencies
const assert = require('assert');
const Settings = require('shallow-settings');

const staticConfig = require('./static');

// Resolve our environment
const env = process.env.ENV;
assert(env, 'Expected environment variable ENV to be set but it was not. ' +
  'Please use `ENV=development`, `ENV=test`, or `ENV=production`');
assert(['development', 'test', 'production'].indexOf(env) !== -1,
  'Expected environment variable ENV to be set be one of `development`, `test`, or `production` ' +
  'but it was "' + env + '"');

// Adjust our NODE_ENV to ENV as well (helps with Express setup)
process.env.NODE_ENV = env;

// Define our settings
exports.getConfig = function () {
  // Load our settings
  let settings = new Settings(staticConfig);
  let config = settings.getSettings({env: env});

  // Return our configuration
  return config;
};
