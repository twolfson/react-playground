// Load in dependencies
const {expect} = require('chai');

const * as httpUtils = require('./utils/http');
const * as serverUtils = require('./utils/server');

// Start our tests
describe('A request to POST /login', function () {
  describe('with a valid email', function () {
    httpUtils.session.init()
      .save(serverUtils.getUrl('/'))
      .save({
        method: 'POST', url: serverUtils.getUrl('/login'),
        htmlForm: {email: 'test-user'},
        // DEV: We use `followAllRedirects` to follow POST redirects
        followRedirect: true, followAllRedirects: true,
        expectedStatusCode: 200
      });

    it('redirects user to root page', function () {
      expect(this.lastRedirect.statusCode).to.equal(302);
      expect(this.lastRedirect.redirectUri).to.match(/\/$/);
    });
    it('logs user in', function () {
      expect(this.body).to.contain('You are logged in as: test-user');
    });
  });

  describe('with an invalid email', function () {
    httpUtils.session.init()
      .save(serverUtils.getUrl('/'))
      .save({
        method: 'POST', url: serverUtils.getUrl('/login'),
        body: '',
        expectedStatusCode: 400
      });

    it('rejects user', function () {
      expect(this.body).to.contain('Missing/malformed parameter: "email"');
    });
  });
});
