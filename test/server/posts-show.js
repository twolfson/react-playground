// Load in dependencies
const {expect} = require('chai');

const httpUtils = require('./utils/http');
const serverUtils = require('./utils/server');
const testUtils = require('./utils/test');

// Start our tests
describe('A request to GET /posts', function () {
  describe.skip('with an empty set of posts', function () {
    httpUtils.save({
      url: serverUtils.getUrl('/posts'),
      expectedStatusCode: 200
    });

    it('shows no posts loaded', function () {
      // TODO: Add me
    });
    it('provides browsers state with no posts', function () {
      // TODO: Add me
    });
  });

  describe('with multiple posts and comments', function () {
    testUtils.setFixtures([dbFixtures.POST_WITH_COMMENTS, dbFixtures.POST_ANOTHER]);
    httpUtils.save({
      url: serverUtils.getUrl('/posts'),
      expectedStatusCode: 200
    });

    it('shows posts and comments', function () {
      // TODO: Add me
      expect(true).to.equal(true);
    });
    it('provides browsers state with posts and comments', function () {
      // TODO: Add me
    });
  });
});
