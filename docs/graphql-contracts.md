# GraphQL contracts
To guarantee consistency between our browser/server tests (i.e. our request/response never goes out of sync), we've built a contract system. These are files stored in `test/test-files/graphql-contracts`.

## Creating a new contract
Contracts are generated via our server side tests. To generate a new contract, use our `httpUtils.save/httpUtils.session.save` method and specify a contract filename:

```js
httpUtils.graphql({
  contract: 'echo-200.json',
  query: `
    query {
      status
    }
  `,
  expectedStatusCode: 200
});
```

If the contract requires any fixtures, please set those up in the relevant test context as well. For example:

```js
testUtils.setFixtures([dbFixtures.POST_WITH_COMMENTS]);
httpUtils.graphql({
  contract: 'posts-full-200.json',
  // ...
});
```

**Notes:**

We had considered a separate script suite entirely but believed that would lead to more sync issues with respect to testing.

## Updating contracts
To update our contracts, run our server-side tests:

```bash
yarn run test-server
# Equivalent to:
# ASSERT_CONTRACTS=FALSE yarn run test-server
```

## Asserting contracts
To assert our contracts, set the `ASSERT_CONTRACTS` environment variable to `TRUE` and run our server-side tests:

```bash
ASSERT_CONTRACTS=TRUE yarn run test-server
```

## Attribution
The file format is heavily inspired by [cassette][] and [eight-track][] but targeted at GraphQL queries and our test setup. As a result, we have more human friendly queries (e.g. `queryLines`) and less information about our request (e.g. HTTP method, request URL, response headers) which leads to less test noise (a common `eight-track` problem).

[cassette]: https://github.com/uber/cassette
[eight-track]: https://github.com/uber/eight-track
