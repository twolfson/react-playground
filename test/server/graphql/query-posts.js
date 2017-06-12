// Load in our dependencies
const {expect} = require('chai');

const httpUtils = require('../utils/http');
const testUtils = require('../utils/test');

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
      posts: [{id: 'example-post-uuid', content: 'This is an example post'}]
    });
  });
});

describe('A GraphQL query request for `posts` with `comments`', function () {
  testUtils.setFixtures(['post', 'comment']);
  httpUtils.graphql({
    query: `
      query {
        posts {
          id
          content
          comments {
            id
            content
          }
        }
      }
    `,
    expectedStatusCode: 200
  });

  it('resolves existing posts and comments', function () {
    expect(this.json.data).to.deep.equal({
      posts: [{
        id: 'example-post-uuid',
        content: 'This is an example post',
        comments: [{
          id: 'example-comment-uuid',
          content: 'This is an example comment'
        }]
      }]
    });
  });
});
