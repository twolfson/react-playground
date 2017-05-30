// Load in our dependencies
import assert from 'assert';

import express from 'express';
import expressGraphql from 'express-graphql';

import {getConfig} from '../config';
import {schema as graphqlSchema} from './models/index.js';

// Load our config
const _config = getConfig();

// Define our server
function Server(config) {
  // Save our config for later
  this.config = config;

  // Create a new server
  const app = this.app = express();

  // Define our routes
  // TODO: When our routes get unwieldy, break them out into another file
  app.get('/', function handleRootShow (req, res, next) {
    res.send('OK');
  });
  if (config.hostGraphiql) {
    app.get('/graphql', expressGraphql({
      schema: graphqlSchema,
      graphiql: true
    }));
  }
  app.post('/graphql', expressGraphql({
    schema: graphqlSchema,
    graphiql: false
  }));
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
const server = new Server(_config);
export default server;
