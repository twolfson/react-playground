// Load in dependencies
import {expect} from 'chai';
import httpUtils from './utils/http';
import serverUtils from './utils/server';

// Start our tests
describe('A request to our server', function () {
  httpUtils.save({
    url: serverUtils.getUrl('/'),
    expectedStatusCode: 200
  });

  it('has no errors', function () {
     // Asserted by `expectedStatusCode`
  });
  it('has expected content', function () {
    expect(this.body).to.equal('OK');
  });
});
