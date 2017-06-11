// Define our constants
const OFF = 'off';
const WARN = 'warn';

// Define our config
module.exports = {
  // Inherit from our package
  extends: 'eslint-config-twolfson',

  // Configure our environment
  // http://eslint.org/docs/user-guide/configuring#specifying-environments
  parser: 'babel-eslint',
  plugins: ['react'],
  parserOptions: {
    ecmaFeatures: {
      jsx: true
    }
  },
  env: {
    browser: true,
    node: true,
    mocha: true
  },

  // Set up ES6 and JSX rules
  rules: {
    'no-var': WARN,
    // Ignore `this` related strict mode warnings
    'no-invalid-this': OFF,

    // Register JSX usage of React and variables
    'react/jsx-uses-react': WARN,
    'react/jsx-uses-vars': WARN
  }
};
