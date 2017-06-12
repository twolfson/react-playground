// Define GraphQL fixture helper
function createGraphQlFixture(fn) {
  return {
    method: 'POST',
    url: '/graphql',
    fn: fn
  };
}

// Define our GraphQL resolver helper
exports.LOADING_ONLY = createGraphQlFixture(function (req) {
  throw new Error('Should not be called due to loading only tests');
});
// exports.
// http://sinonjs.org/releases/v2.3.4/fake-xhr-and-server/#simulating-server-responses
