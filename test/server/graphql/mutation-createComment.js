// Load in our dependencies
import {expect} from 'chai';

import * as httpUtils from '../utils/http';
import * as testUtils from '../utils/test';
import {Comment} from '../../../server/models/comment';
import {Post} from '../../../server/models/post';

// Define our tests
describe('A GraphQL mutation request for `createComment`', function () {
  // Format taken from: http://graphql.org/graphql-js/mutations-and-input-types/
  describe.only('for an existing post', function () {
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
      expect(comments[0]).to.have.keys(['id', 'content']);
      expect(comments[0].content).to.equal('hi');
    });

    it('adds comment to our post in our database', function () {
      let post = Post.fetchById('example-post');
      expect(post.comments).to.have.lengthOf(1);
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
