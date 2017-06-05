// Load in our dependencies
import {expect} from 'chai';

import * as httpUtils from '../utils/http';
import * as testUtils from '../utils/test';

// Define our tests
describe('A GraphQL query request for `posts`', function () {
  testUtils.setFixtures(['post']);
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
    expect(this.json.data).to.deep.equal({
      posts: [{id: 'example-post-uuid', content: 'foobar'}]
    });
  });
});
