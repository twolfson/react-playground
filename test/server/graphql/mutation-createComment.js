// Load in our dependencies
const {expect} = require('chai');

const httpUtils = require('../utils/http');
const testUtils = require('../utils/test');
const {Comment} = require('../../../server/models/comment');

// Define our tests
describe('A GraphQL mutation request for `createComment`', function () {
  // Format taken from: http://graphql.org/graphql-js/mutations-and-input-types/
  describe('for an existing post', function () {
    testUtils.setFixtures(['post']);
    httpUtils.graphql({
      query: `
        mutation {
          createComment(input: {
            postId: "example-post-uuid"
            content: "test-comment"
          }) {
            id
            content
          }
        }
      `,
      expectedStatusCode: 200
    });

    it('save a comment to our database', function () {
      let comments = Comment.getAll();
      expect(comments).to.have.lengthOf(1);
      expect(comments[0]).to.have.keys(['id', 'postId', 'content']);
      expect(comments[0].postId).to.equal('example-post-uuid');
      expect(comments[0].content).to.equal('test-comment');
    });
  });

  describe('for a non-existing post', function () {
    testUtils.setFixtures([]);
    httpUtils.graphql({
      query: `
        mutation {
          createComment(input: {
            postId: "does-not-exist"
            content: "hi"
          }) {
            id
            content
          }
        }
      `,
      expectedError: {message: 'Not Found', path: 'createComment'},
      expectedStatusCode: 200
    });

    it('receives a not found error', function () {
      // Asserted by `expectedError`
    });
  });
});
