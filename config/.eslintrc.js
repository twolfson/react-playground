// Define our constants
const OFF = 'off';
const WARN = 'warn';

// Define our config
module.exports = {
  rules: {
    // Allow `module`, `exports`, and `require` due to ES5 Webpack loading this directory
    'no-restricted-globals': OFF,
  }
};
