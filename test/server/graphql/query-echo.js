// Load in our dependencies
import {expect} from 'chai';

import * as httpUtils from '../utils/http';

// Define our tests
describe('A GraphQL query request for `echo`', function () {
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
