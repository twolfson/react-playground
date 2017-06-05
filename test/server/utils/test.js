// Load in our dependencies
import assert from 'assert';

import _ from 'underscore';

import {posts, postsById} from '../../../server/models/post';

// Define common fixtures
const fixturesByName = {
  post: {
    model: 'post',
    data: {
      id: 'example-post-uuid',
      content: 'foobar'
    }
  }
};

// Define our helpers
export const setFixtures = function (fixtureNames) {
  before(function setFixturesFn () {
    // Resolve our input fixtures
    let fixtures = fixtureNames.map(function resolveFixture (fixtureName) {
      // Look up our fixture
      let _fixture = fixturesByName[fixtureName];
      assert(_fixture, `Unable to find fixture by name "${fixtureName}"`);

      // Clone and return our fixture
      return _.clone(_fixture);
    });

    // Reset our existing models
    posts.length = 0;
    Object.keys(postsById).forEach(function removePostById (id) {
      delete postsById[id];
    });

    // Install our fixtures
    fixtures.forEach(function installFixture (fixture) {
      if (fixture.model === 'post') {
        posts.push(fixture.data);
        postsById[fixture.data.id] = fixture.data;
      } else {
        throw new Error(`Unidentified fixture model "${fixture.model}"`);
      }
    });
  });
};
