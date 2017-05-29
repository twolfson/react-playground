// Load in our dependencies
const assert = require('assert');
const express = require('express');
const _config = require('../config').getConfig();

// Define our server
function Server(config) {
  // Save our config for later
  this.config = config;

  // Create a new server
  const app = this.app = express();

  // Define a root route
  app.get('/', function handleRootShow (req, res, next) {
    res.send('OK');
  });
}
Server.prototype.listen = function () {
  assert.strictEqual(this._app, undefined, 'A server is already listening to a port. Please `close` first');
  this._app = this.app.listen(this.config.listen.port, this.config.listen.hostname);
};
Server.prototype.close = function (cb) {
  assert.notEqual(this._app, undefined, 'No server was found to `close`');
  this._app.close(cb);
  delete this._app;
};

// Export an initialized yet not listening server
module.exports = new Server(_config);
