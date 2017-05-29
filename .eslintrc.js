// Define our constants
const WARN = 'warn';

// Define our config
module.exports = {
  // Inherit from our package
  extends: 'eslint-config-twolfson',

  // Configure our environment
  // http://eslint.org/docs/user-guide/configuring#specifying-environments
  env: {
    node: true,
    mocha: true,
    es6: true
  },

  // Set up ES6 rules
  rules: {
    'no-var': WARN
  }
};
