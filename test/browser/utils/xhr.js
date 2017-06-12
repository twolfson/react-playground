// Load in our dependencies
const assert = require('assert');

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
/* eslint-disable global-require */
const graphqlContractsByFilepath = {
  'posts-and-comments-empty-200.json': require(__dirname + '/../../test-files/graphql-contracts' +
    '/posts-and-comments-empty-200.json'),
  'posts-and-comments-full-200.json': require(__dirname + '/../../test-files/graphql-contracts' +
    '/posts-and-comments-full-200.json')
};
/* eslint-enable global-require */
exports.graphql = function (filepaths) {
  // Load our matching filepaths
  assert(Array.isArray(filepaths), `Expected ${filepaths} to be an array but it wasn't`);
  const graphqlContracts = filepaths.map(function resolveGraphqlContract (filepath) {
    const graphqlContract = graphqlContractsByFilepath[filepath];
    assert(graphqlContract,
      `Unable to find GraphQL contract for "${filepath}". Please verify it's loaded via \`require\``);
    return graphqlContract;
  });

  // Return a mock XHR response for our GraphQL endpoint
  // TODO: Find matching contracts
  assert.strictEqual(graphqlContracts.length, 1,
    'Only 1 GraphQL contract supported at a time due to lack of matching support');
  return {
    method: 'POST',
    url: '/graphql',
    fn: function (req) {
      // http://sinonjs.org/releases/v2.3.4/fake-xhr-and-server/#simulating-server-responses
      const graphqlContract = graphqlContracts[0];
      req.respond(graphqlContract.response.statusCode, {},
        JSON.stringify(graphqlContract.response.body));
    }
  };
};
