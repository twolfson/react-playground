// Load in our dependencies
const url = require('url');

const _ = require('underscore');

const server = require('../../../server/index.js');

// Start our server immediately
// TODO: Start server globally before other tests via a `--require`
server.listen();

// Re-expose server, app, and its config for convenience
export {server};
export const app = server.app;
export const config = server.config;

/**
 * Retrieve a URL for our running server
 * @param params {Object|String} Information for URL
 *   If this is a string, we will assume it's the URL path
 *   Otherwise (object), we will treat it as `url.format` parameters
 * @returns URL string (e.g. `http://localhost:PORT/hello`)
 */
export const getUrl = function (params) {
  // If the parameter is a string, upcast it to an object
  if (typeof params === 'string') {
    params = {pathname: params};
  }

  // Return our formatted URL
  return url.format(_.defaults(params, config.url.internal));
};
