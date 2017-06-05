// Load in our dependencies
import {expect} from 'chai';

import * as httpUtils from '../utils/http';

// Define our tests
describe('A GraphQL mutation request for `createPost`', function () {
  // Format taken from: http://graphql.org/graphql-js/mutations-and-input-types/
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
});
