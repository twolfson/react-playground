// Load in our dependencies
import {expect} from 'chai';

import * as httpUtils from '../utils/http';

// Define our tests
describe.only('A GraphQL mutation request for `createPost`', function () {
  // Format taken from: http://graphql.org/graphql-js/mutations-and-input-types/
  httpUtils.graphql({
    query: `
      mutation {
        createPost(input: {
          content: "hi"
        }) {
          content
        }
      }
    `,
    expectedStatusCode: 200
  });

  it('reuses input as output', function () {
    expect(this.json).to.deep.equal({data: {createPost: {content: 'hi'}}});
  });
});
