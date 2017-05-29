// Load in dependencies
var assert = require('assert');
var reactPlayground = require('../');

// Start our tests
describe('react-playground', function () {
  it('returns awesome', function () {
    assert.strictEqual(reactPlayground(), 'awesome');
  });
});
