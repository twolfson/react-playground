// Load in our dependencies
const assert = require('assert');

const _ = require('underscore');
const sinon = require('sinon');
const graphqlLanguage = require('graphql/language');

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
function extendGraphqlContract(graphqlContract, filepath) {
  // Save our filepath for ease of reference
  graphqlContract.filepath = filepath;

  // Parse our query lines into a query
  const query = graphqlContract.request.query = graphqlContract.request.queryLines.join('\n');
  const parsedQuery = graphqlContract.request.parsedQuery = graphqlLanguage.parse(query);
  graphqlContract.request.cleanedQuery = graphqlLanguage.print(parsedQuery);

  // Return our contract
  return graphqlContract;
}
const graphqlContractsByFilepath = {
  'posts-and-comments-empty-200.json': require(__dirname + '/../../test-files/graphql-contracts' +
    '/posts-and-comments-empty-200.json'),
  'posts-and-comments-full-200.json': require(__dirname + '/../../test-files/graphql-contracts' +
    '/posts-and-comments-full-200.json')
};
_.each(graphqlContractsByFilepath, extendGraphqlContract);
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
  return {
    method: 'POST',
    url: '/graphql',
    fn: function (req) {
      // Load our request body
      const reqBody = JSON.parse(req.requestBody);
      const reqQuery = reqBody.query;
      assert(reqQuery, `No \`query\` was specified for "${req.requestBody}"`);
      const variables = reqBody.variables || {};
      const parsedReqQuery = graphqlLanguage.parse(reqQuery);
      const cleanedReqQuery = graphqlLanguage.print(parsedReqQuery);

      // Find our matching contract
      const matchingContracts = graphqlContracts.filter(function isMatchingContract (graphqlContract) {
        // TODO: Perform subsetting matching (e.g. via `graphqlLanguage.parse`)
        // TODO: Add variables matching
        return graphqlContract.request.cleanedQuery === cleanedReqQuery;
      });
      assert.notEqual(matchingContracts.length, 0,
        `Unable to find matching GraphQL contract for query "${reqQuery}" ` +
        `and variables "${JSON.stringify(variables)}"`);
      assert.strictEqual(matchingContracts.length, 1,
        `Found multiple matching GraphQL contracts for query "${reqQuery}" ` +
        `and variables "${JSON.stringify(variables)}". ` +
        `Matching queries: ${JSON.stringify(_.pluck(matchingContracts, 'filepath'))}`);
      const matchingContract = matchingContracts[0];

      // http://sinonjs.org/releases/v2.3.4/fake-xhr-and-server/#simulating-server-responses
      req.respond(matchingContract.response.statusCode, {},
        JSON.stringify(matchingContract.response.body));
    }
  };
};
