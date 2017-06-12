// Load in our dependencies
const assert = require('assert');
const fs = require('fs');

const sinon = require('sinon');

// Define `xhrUtils.mock`
exports.mock = function (responses) {
  before(function callMockXHR () {
    // Create our server
    // http://sinonjs.org/docs/#fakeServer
    // DEV: `this.sinonServer.respond()` must be called to trigger responses
    //   This allows us to test loading states
    assert(!this.sinonServer, 'Expected no Sinon server to be running but one is. ' +
      'Please only use `testUtils.mockXHR` once per test');
    this.sinonServer = sinon.fakeServer.create();

    // Resolve GraphQL specific fixtures
    responses = responses.map(function resolveGraphQLFixtures (response) {
      if (response.graphql) {
        // graphqlFixtures(['posts-and-comments-empty-200.json'])
        return graphqlFixtures(response.graphql);
      } else {
        return response;
      }
    });

    // Bind our responses
    this.requests = [];
    const that = this;
    responses.forEach(function bindResponse (response) {
      that.sinonServer.respondWith(response.method, response.url, function handleRequest (req) {
        // Save our request
        that.requests.push(req);
        if (that.onRequest) {
          that.onRequest(req);
        }

        // Call our fixture
        return response.fn.apply(that, arguments);
      });
    });
  });
  after(function cleanup () {
    this.sinonServer.restore();
    delete this.sinonServer;
  });
};

// Define our GraphQL fixtures
exports.GRAPHQL_LOADING_ONLY = {
  method: 'POST',
  url: '/graphql',
  fn: function (req) {
    throw new Error('GRAPHQL_LOADING_ONLY was run when it should never be run. ' +
      'Please remove any `this.sinonServer.respond()`');
  }
};
const filepathCache = {};
exports.graphql = function (filepaths) {
  // Load our matching filepaths
  assert(Array.isArray(filepaths), `Expected ${filepaths} to be an array but it wasn't`);
  // DEV: If we run into trouble with Webpack/Browserify due to dynamic `fs`, update `filepathCache` to generate statically and make this an `assert`
  const graphqlResponses = filepaths.map(filepaths, function resolveGraphqlResponse (filepath) {
    const graphqlResponse = filepathCache[filepath] || fs.readFileSync(
      __dirname + '/../../test-files/graphql-contracts/' + filepath, 'utf8');
    filepathCache[filepath] = graphqlResponse;
    return graphqlResponse;
  });
  console.log(graphqlResponses);
};
// http://sinonjs.org/releases/v2.3.4/fake-xhr-and-server/#simulating-server-responses
