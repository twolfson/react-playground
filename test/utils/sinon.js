// Load in our dependencies
const assert = require('assert');

const sinon = require('sinon');

// XHR mocking
exports.mockXHR = function (responses) {
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
