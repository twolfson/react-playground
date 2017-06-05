// Load in our dependencies
import {expect} from 'chai';

import * as httpUtils from '../utils/http';
import * as testUtils from '../utils/test';
import {posts} from '../../../server/models/post';

// Define our tests
describe('A GraphQL mutation request for `createPost`', function () {
  // Format taken from: http://graphql.org/graphql-js/mutations-and-input-types/
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

  it('reuses input as output', function () {
    let post = this.json.data.createPost;
    expect(post).to.have.keys(['id', 'content']);
    expect(post.content).to.equal('hi');
  });

  it('saves a post to our database', function () {
    expect(posts).to.have.lengthOf(1);
    expect(posts[0]).to.have.property('content', 'hi');
  });
});
