// Load in our dependencies
const _ = require('underscore');

// Define our configurations
// TODO: Configure session more robustly
// https://github.com/expressjs/session/tree/v1.15.3#sessionoptions
exports.common = {
  session: {
    cookie: {
      maxAge: 1000 * 60 * 60 * 24 * 7 * 2 // 2 weeks
    },
    resave: false, // Don't resave by default to prevent override
    saveUninitialized: true, // Always save new sessions
    secret: undefined, // OVERRIDE: Need to override in each environment
    unset: 'destroy' // Destroy deleted sessions
  },
  sessionsDir: __dirname + '/../sessions'
};

exports.development = {
  session: _.defaults({
    secret: 'DEVELOPMENT SECRET'
  }, exports.common.session)
};

exports.test = {
  session: _.defaults({
    secret: 'TEST SECRET'
  }, exports.common.session),
  sessionsDir: __dirname + '/../sessions-test'
};
