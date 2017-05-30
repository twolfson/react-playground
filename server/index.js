// Load in our dependencies
import assert from 'assert';

import _ from 'underscore';
import bodyParser from 'body-parser';
import connectSqlite3 from 'connect-sqlite3';
import express from 'express';
import expressSession from 'express-session';
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

  // Set up body parsing
  app.use(bodyParser.urlencoded({
    extended: false, type: 'application/x-www-form-urlencoded'}));

  // Set up our sessions
  const SQLiteStore = connectSqlite3(expressSession);
  app.use(expressSession(_.defaults({
    store: new SQLiteStore()
  }, config.session)));

  // Define our routes
  // Generic application routes
  // TODO: When our routes get unwieldy, break them out into another file
  app.get('/', function handleRootShow (req, res, next) {
    let email = req.session.email;
    res.send(
      // TODO: Transition to React
      // TODO: Escape email to prevent XSS
      '<h1>react-playground</h1>' +
      '<p>' +
        (email ? 'You are logged in as: ' + email : 'You are not logged in') +
      '</p>' +
      // TODO: Add CSRF to form
      '<form method="POST" action="/login">' +
        '<div>' +
          '<label for="email">Email: </label>' +
          '<input name="email"/>' +
        '</div>' +
        '<div>' +
          '<button type="submit">Login</button>' +
        '</div>' +
      '</form>' +
      '<p>' +
        '<a href="/logout">Log out</a>' +
      '</p>');
  });
  app.post('/login', function handleLoginSave (req, res, next) {
    // Resolve our parameters
    // TODO: Use `querystring-multidict` instead of one-off param checking
    let email = req.body.email;
    if (typeof email !== 'string') {
      res.status(400).send('Missing/malformed parameter: "email"');
      return;
    }

    // Save our email and redirect to the root page
    // DEV: We don't do password/etc as this is a proof of concept
    req.session.email = email;
    res.redirect('/');
  });

  // Healthcheck route
  app.get('/status', function handleRootShow (req, res, next) {
    res.send('OK');
  });

  // GraphQL routes
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
