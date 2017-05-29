// Load in our dependencies
var url = require('url');
var _ = require('underscore');
var server = require('../../../server/index.js');

// Start our server immediately
// TODO: Start server globally before other tests via a `--require`
server.listen();

// Re-expose server, app, and its config for convenience
exports.server = server;
exports.app = server.app;
exports.config = server.config;

/**
 * Retrieve a URL for our running server
 * @param params {Object|String} Information for URL
 *   If this is a string, we will assume it's the URL path
 *   Otherwise (object), we will treat it as `url.format` parameters
 * @returns URL string (e.g. `http://localhost:PORT/hello`)
 */
exports.getUrl = function (params) {
  // If the parameter is a string, upcast it to an object
  if (typeof params === 'string') {
    params = {pathname: params};
  }

  // Return our formatted URL
  return url.format(_.defaults(params, exports.config.url.internal));
};
