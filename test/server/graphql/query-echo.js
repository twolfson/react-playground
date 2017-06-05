// Load in our dependencies
import {expect} from 'chai';

import * as httpUtils from '../utils/http';

// Define our tests
describe('A GraphQL query request for `echo` via arguments', function () {
  httpUtils.graphql({
    body: `
      query {
        echo(content: "hi")
      }
    `,
    expectedStatusCode: 200
  });

  it('reuses input as output', function () {
    expect(this.json).to.deep.equal({data: {echo: 'hi'}});
  });
});

describe.only('A GraphQL query request for `echo` via variables', function () {
  httpUtils.graphql({
    // https://medium.com/the-graphqlhub/graphql-tour-variables-58c6abd10f56
    body: JSON.stringify({
      query: `
        query ($content: String) {
          echo(content: $content)
        }
      `,
      variables: {
        content: 'hello'
      }
    }),
    expectedStatusCode: 200
  });

  it('reuses input as output', function () {
    expect(this.json).to.deep.equal({data: {echo: 'hello'}});
  });
});
