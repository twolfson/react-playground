// Load in our dependencies
import _ from 'underscore';

// Define our configurations
// TODO: Configure session more robustly
// https://github.com/expressjs/session/tree/v1.15.3#sessionoptions
export let common = {
  session: {
    cookie: {
      maxAge: 1000 * 60 * 60 * 24 * 7 * 2 // 2 weeks
    },
    resave: false, // Don't resave by default to prevent override
    saveUninitialized: true, // Always save new sessions
    secret: undefined, // OVERRIDE: Need to override in each environment
    unset: 'destroy' // Destroy deleted sessions
  }
};

export let development = {
  session: _.defaults({
    secret: 'DEVELOPMENT SECRET'
  }, common.session)
};

export let test = {
  session: _.defaults({
    secret: 'TEST SECRET'
  }, common.session)
};
