// Load in dependencies
import {expect} from 'chai';
import * as httpUtils from './utils/http';
import * as serverUtils from './utils/server';

// Start our tests
describe('A request to POST /graphql server', function () {
  httpUtils.save({
    method: 'POST', url: serverUtils.getUrl('/graphql'),
    body: `
      foo {
        bar
      }
    `,
    expectedStatusCode: 200
  });

  it('has no errors', function () {
     // Asserted by `expectedStatusCode`
  });
  it('has expected content', function () {
    expect(this.body).to.equal('OK');
  });
});
