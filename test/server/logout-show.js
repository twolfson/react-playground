// Load in dependencies
const {expect} = require('chai');

const httpUtils = require('./utils/http');
const serverUtils = require('./utils/server');

// Start our tests
describe('A request to GET /logout', function () {
  // Perform initial login and verify we are logged in
  httpUtils.session.init().login()
    .save(serverUtils.getUrl('/'));
  before(function verifyLoggedIn () {
    expect(this.body).to.contain('You are logged in as: dev-user');
  });

  // Perform logout
  httpUtils.session.save({
    url: serverUtils.getUrl('/logout'),
    followRedirect: true,
    expectedStatusCode: 200
  });

  // Perform our asserts
  it('redirects user to root page', function () {
    expect(this.lastRedirect.statusCode).to.equal(302);
    expect(this.lastRedirect.redirectUri).to.match(/\/$/);
  });
  it('logs user out', function () {
    expect(this.body).to.contain('You are not logged in');
  });
});
