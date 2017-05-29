# react-playground [![Build status](https://travis-ci.org/twolfson/react-playground.svg?branch=master)](https://travis-ci.org/twolfson/react-playground)

Playground environment for GraphQL, React, and more

We've already used React in [plaidchat][] but want to take things further. In this repo, we plan to cover exploring:

- [ ] ES6 imports/exports
- [ ] GraphQL
- [ ] React
- [ ] JSX
- [ ] Relay
- [ ] Webpack
- [ ] Server side rendering

[plaidchat]: https://github.com/plaidchat/plaidchat/tree/v2.15.1

## Getting Started
To get our repo running locally, run the following steps:

```bash
# Clone our repository
git clone https://github.com/twolfson/react-playground
cd react-playground

# Install our dependencies
npm install

# Start our server
npm run start
# Server running at http://localhost:5000/
```

Our application will be accessible at <http://localhost:5000/>

## Documentation
### Development
To run our server in development mode (i.e. restart on any server-code change), run:

```bash
npm run start-develop
```

### Testing
To run our test suite, run:

```bash
npm test
```

To run server tests specifically, run:

```bash
npm run test-server
```

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
