// Load in dependencies
import {expect} from 'chai';

import * as httpUtils from './utils/http';
import * as serverUtils from './utils/server';

// Start our tests
describe('A request to GET /', function () {
  describe('from an authenticated user', function () {
    httpUtils.session.init().login()
      .save({
        url: serverUtils.getUrl('/'),
        expectedStatusCode: 200
      });

    it('shows user as logged in', function () {
      expect(this.body).to.contain('You are logged in as: dev-user');
    });
    it('has a login form', function () {
      expect(this.$('form[action="/login"]')).to.have.lengthOf(1);
    });
    it('has a logout link', function () {
      expect(this.$('a[href="/logout"]')).to.have.lengthOf(1);
    });
  });

  describe('from an logged out user', function () {
    httpUtils.save({
      url: serverUtils.getUrl('/'),
      expectedStatusCode: 200
    });

    it('shows user as logged out', function () {
      expect(this.body).to.contain('You are not logged in');
    });
    it('has a login form', function () {
      expect(this.$('form[action="/login"]')).to.have.lengthOf(1);
    });
    it('has a logout link', function () {
      expect(this.$('a[href="/logout"]')).to.have.lengthOf(1);
    });
  });
});
