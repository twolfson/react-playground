// Load in our dependencies
import {expect} from 'chai';

import * as httpUtils from '../utils/http';
import * as testUtils from '../utils/test';

// Define our tests
describe.skip('A GraphQL query request for `posts`', function () {
  testUtils.setFixtures([]);
  httpUtils.graphql({
    query: `
      query {
        posts {
          id
          content
        }
      }
    `,
    expectedStatusCode: 200
  });

  it('resolves existing posts', function () {
    expect(this.json.posts).to.deep.equal(['id', 'content']);
  });
});
