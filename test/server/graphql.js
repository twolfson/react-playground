// Load in dependencies
import {expect} from 'chai';
import * as httpUtils from './utils/http';

// Start our tests
describe('A request to POST /graphql server', function () {
  httpUtils.graphql({
    body: `
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
