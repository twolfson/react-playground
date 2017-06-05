// Load in our dependencies
import {expect} from 'chai';

import * as httpUtils from '../utils/http';
import * as testUtils from '../utils/test';
import {Post} from '../../../server/models/post';

// Define our tests
describe('A GraphQL mutation request for `createComment`', function () {
  // Format taken from: http://graphql.org/graphql-js/mutations-and-input-types/
  describe('for an existing post', function () {
    it('save a comment to our database', function () {
    });

    it('adds comment to our post in our database', function () {
      let post = Post.fetchById('example-post');
      expect(post.comments).to.have.lengthOf(1);
      expect(post.comments[0]).to.have.property('content', 'hi');
    });
  });

  describe.only('for a non-existing post', function () {
    testUtils.setFixtures([]);
    httpUtils.graphql({
      query: `
        mutation {
          createPost(input: {
            content: "hi"
          }) {
            id
            content
          }
        }
      `,
      expectedStatusCode: 200
    });
    it('throws a 404', function () {
      // Asserted by `expectedStatusCode`
    });
  });
});
