# react-playground [![Build status](https://travis-ci.org/twolfson/react-playground.svg?branch=master)](https://travis-ci.org/twolfson/react-playground)

Playground environment for GraphQL, React, and more

We've already used React in [plaidchat][] but want to take things further. In this repo, we plan to cover exploring:

- [x] Yarn
- [x] ES6 imports/exports
    - Dropped in `1.15.0` due to causing more frustration than adding value
        - Example: `react-hot-loader` requires `modules: false`
        - Example: Doesn't play well with mocking https://github.com/babel/babel/issues/3811
- [x] GraphQL
    - [x] Basic query
    - [x] Authorization
    - [x] Arguments and variables
    - [x] Mutations
    - [x] Relationships/connections/edges
- [x] React
    - [x] Static content
    - [x] Data fetching
    - [ ] Data posting
- [x] JSX
- [ ] Webpack
    - [x] Basic compilation
    - [x] LiveReload integration
    - [x] Hot module reload integration
        - Dropped in `1.15.1` due to causing more frustration than adding value
            - `react-hot-loader@3.0.0-beta6` refused to work with CommonJS
            - Required separate `.babelrc` invocation
            - Limited usefulness -- no CSS or HTML reloading, better to supplement LiveReload than replace it
    - [ ] Bundle splitting
- [ ] Server side rendering
    - [x] Static content
    - [ ] Data fetching
- [ ] Relay

[plaidchat]: https://github.com/plaidchat/plaidchat/tree/v2.15.1

**Note:** Due to this being a playground, we've cut some corners. Here's our short list

- Using a bespoke in-memory ORM
- Missing CSRF security

## Getting Started
To get our repo running locally, run the following steps:

```bash
# Install yarn globally
# DEV: We use yarn due to linking all dependencies to their "first lookup" locations
#   Without this, `babel-node` takes a lot longer in its lookups on disk
#   https://github.com/babel/babel/issues/2706
npm install --global yarn

# Clone our repository
git clone https://github.com/twolfson/react-playground
cd react-playground

# Install our dependencies
yarn install

# Start our server
yarn start
# Server running at http://localhost:5000/
```

Our application will be accessible at <http://localhost:5000/>

## Documentation
### Development
To run our server in development mode (i.e. restart on any server-code change), run:

```bash
yarn run start-develop
```

To compile assets continuously and host a LiveReload server, run:

```bash
yarn run develop
```

### Testing
To run our test suite, run:

```bash
yarn test
```

To run our server tests specifically, run:

```bash
yarn run test-server
```

To run our browser tests specifically, run:

```bash
# Single run
yarn run test-browser-single

# Continuous mode
yarn run test-browser-continuous
```

To debug our browser tests:

- Add a `.only` flag to the desired test
    - This will trigger unmounting of the element on our debug page
- Run our tests in debuggable mode (continuous runs + visible window)
    - `yarn run test-browser-debug`
- Click "Debug" button in Karma
    - New window should have rendered content and Developer Tools can be used

### Debugging GraphQL
In development, we host [GraphiQL][] at the GraphQL endpoint. It can be accessed by visiting:

<http://localhost:5000/graphql>

[GraphiQL]: https://github.com/graphql/graphiql

## Contributing
In lieu of a formal styleguide, take care to maintain the existing coding style. Add unit tests for any new or changed functionality. Lint via `npm run lint` and test via `npm test`.

## Donating
Support this project and [others by twolfson][twolfson-projects] via [donations][twolfson-support-me].

<http://twolfson.com/support-me>

[twolfson-projects]: http://twolfson.com/projects
[twolfson-support-me]: http://twolfson.com/support-me

## Unlicense
As of May 29 2017, Todd Wolfson has released this repository and its contents to the public domain.

It has been released under the [UNLICENSE][].

[UNLICENSE]: UNLICENSE
