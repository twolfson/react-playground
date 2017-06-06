// Load in our dependencies
import assert from 'assert';

import _ from 'underscore';
import bodyParser from 'body-parser';
import express from 'express';
import expressSession from 'express-session';
import expressGraphql from 'express-graphql';
import expressReactViews from 'express-react-views';
import expressSessionLevel from 'express-session-level';
import levelup from 'levelup';

import {getConfig} from '../config';
import {schema as graphqlSchema} from './graphql/index.js';

// Load our config
const _config = getConfig();

// Define our server
function Server(config) {
  // Save our config for later
  this.config = config;

  // Create a new server
  const app = this.app = express();

  // Configure our views
  // http://expressjs.com/en/guide/using-template-engines.html
  // https://github.com/reactjs/express-react-views/tree/v0.10.1#usage
  app.set('views', __dirname + '/views');
  app.set('view engine', 'jsx');
  app.engine('jsx', expressReactViews.createEngine({
    beautify: false,
    transformViews: false // `babel-register` is performed via `babel-node` wrapper
  }));
  // DEV: We set view cache to true during testing for performance
  //   https://gist.github.com/twolfson/f81a4861d834929abcf3
  app.set('view cache', config.viewCache);

  // Set up body parsing
  app.use(bodyParser.urlencoded({extended: false}));

  // Set up our sessions
  const levelDb = levelup(config.sessionsDir);
  const LevelStore = expressSessionLevel(expressSession);
  app.use(expressSession(_.defaults({
    store: new LevelStore(levelDb)
  }, config.session)));

  // Set up our static content
  app.use('/browser-dist', express.static(__dirname + '/../browser-dist'));

  // Define our routes
  // Generic application routes
  // DEV: When our routes get unwieldy, break them out into another file
  app.get('/', function handleRootShow (req, res, next) {
    res.render('root.jsx', {
      email: req.session.email
    });
  });
  app.get('/posts', function handlePostsShow (req, res, next) {
    res.render('posts.jsx');
  });
  app.post('/login', function handleLoginSave (req, res, next) {
    // Resolve our parameters
    // TODO: Use `querystring-multidict` instead of one-off param checking
    // DEV: Email can be an array if it's provided multiple times to default `querystring` library via `email[]`
    let email = req.body.email;
    if (typeof email !== 'string') {
      res.status(400).send('Missing/malformed parameter: "email"');
      return;
    }

    // Save our email and redirect to the root page
    // DEV: We don't do password/etc as this is a proof of concept
    // TODO: Regenerate session id and destroy past one in SQLite3 to prevent fixation
    req.session.email = email;
    res.redirect('/');
  });
  app.get('/logout', function handleLogoutShow (req, res, next) {
    // Destroy our session and redirect to root page
    // TODO: Destroy underlying session in SQLite3 to prevent fixation
    delete req.session;
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
  app.post('/graphql', [
    // DEV: We could support `application/graphql` but prefer a consistent format for this repo
    //   We must use JSON for variable support
    //   Here's our `application/graphql` variant: https://github.com/twolfson/react-playground/blob/1.5.1/server/index.js#L101-L108
    bodyParser.json(),
    expressGraphql({
      schema: graphqlSchema,
      graphiql: false,
      formatError: function (err) {
        // Based on https://github.com/graphql/graphql-js/blob/v0.10.1/src/error/formatError.js
        let retVal = {
          message: err.message,
          locations: err.locations,
          path: err.path
        };
        if (config.exposeStack) {
          // DEV: We use `.split(\n)` to make JSON stringified errors legible
          retVal.stack = err.stack.split(/\n/g);
        }
        return retVal;
      }
    })
  ]);
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
