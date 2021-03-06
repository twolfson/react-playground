// Load in our dependencies
const {expect} = require('chai');

const httpUtils = require('./utils/http');

// Start our tests
describe('A request to POST /graphql server', function () {
  httpUtils.graphql({
    query: `
      query {
        status
      }
    `,
    expectedStatusCode: 200
  });

  it('has no errors', function () {
     // Asserted by `expectedStatusCode`
  });
  it('has expected content', function () {
    expect(this.json).to.deep.equal({data: {status: 'OK'}});
  });
});

describe('A GraphQL request about authenticated content', function () {
  describe('from an authenticated user', function () {
    httpUtils.session.init().login()
      .graphql({
        query: `
          query {
            whoami
          }
        `,
        expectedStatusCode: 200
      });

    it('receives authenticated content', function () {
      expect(this.json).to.deep.equal({data: {whoami: 'dev-user@react-playground.test'}});
    });
  });

  describe('from an unauthenticated user', function () {
    httpUtils.session.init()
      .graphql({
        query: `
          query {
            whoami
          }
        `,
        expectedError: {message: 'Forbidden', path: 'whoami'}
      });

    it('receives authentication error', function () {
      // Asserted by `expectedError`
    });
  });
});
