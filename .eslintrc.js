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
    ecmaVersion: 6,
    sourceType: 'module',
    ecmaFeatures: {
      jsx: true
    }
  },
  env: {
    node: true,
    mocha: true
  },

  // Set up ES6 and JSX rules
  rules: {
    'no-var': WARN,
    // Ignore `this` related strict mode warnings
    'no-invalid-this': OFF,
    // Disallow CommonJS module/exports
    'no-restricted-globals': [WARN, 'require', 'module', 'exports'],

    // Register JSX usage of React and variables
    'react/jsx-uses-react': WARN,
    'react/jsx-uses-vars': WARN
  }
};
