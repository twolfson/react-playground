// Load in our dependencies
const {expect} = require('chai');

const dbFixtures = require('../utils/db-fixtures');
const httpUtils = require('../utils/http');
const testUtils = require('../utils/test');

// Define our tests
describe('A GraphQL query request for `posts`', function () {
  testUtils.setFixtures([dbFixtures.POST]);
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
  testUtils.setFixtures([dbFixtures.POST_WITH_COMMENT]);
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

describe('GraphQL contracts for `posts` with `comments`', function () {
  describe('Contract: No posts', function () {
    testUtils.setFixtures([]);
    httpUtils.graphql({
      contract: 'posts-and-comments-empty-200.json',
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

    it('has no errors', function () {
      // Asserted by `expectedStatusCode`
    });
  });

  describe('Contract: Posts and comments', function () {
    testUtils.setFixtures([]);
    httpUtils.graphql({
      contract: 'posts-and-comments-full-200.json',
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

    it('has no errors', function () {
      // Asserted by `expectedStatusCode`
    });
  });
});
