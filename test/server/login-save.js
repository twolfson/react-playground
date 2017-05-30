// Load in dependencies
import {expect} from 'chai';

import * as httpUtils from './utils/http';
import * as serverUtils from './utils/server';

// Start our tests
describe('A request to POST /login', function () {
  describe('with a valid email', function () {
    httpUtils.session.init()
      .save(serverUtils.getUrl('/'))
      .save({
        method: 'POST', url: serverUtils.getUrl('/login'),
        htmlForm: {email: 'test-user'},
        expectedStatusCode: 200
      });

    it('redirects user to root page', function () {
      expect(this.lastRedirect).to.equal(10000);
    });
    it('logs user in', function () {
      expect(this.body).to.contain('You are logged in as: test-userrrr');
    });
  });

  // TODO: Support detecting missing/invalid emails (should use `querystring-multidict`)
  describe.skip('with an invalid email', function () {
    httpUtils.session.init()
      .save(serverUtils.getUrl('/'))
      .save({
        method: 'POST', url: serverUtils.getUrl('/login'),
        htmlForm: {},
        expectedStatusCode: 200
      });

    it('rejects user', function () {
      expect(this.body).to.contain('Missing key "email"');
    });
  });
});
