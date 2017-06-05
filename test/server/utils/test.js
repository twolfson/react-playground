// Load in our dependencies
import assert from 'assert';

import _ from 'underscore';

import {Post} from '../../../server/models/post';

// Define common fixtures
const fixturesByName = {
  post: {
    model: 'post',
    attrs: {
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
    Post.deleteAll();

    // Install our fixtures
    fixtures.forEach(function installFixture (fixture) {
      if (fixture.model === 'post') {
        let post = new Post(fixture.attrs);
        post.save();
      } else {
        throw new Error(`Unidentified fixture model "${fixture.model}"`);
      }
    });
  });
};
