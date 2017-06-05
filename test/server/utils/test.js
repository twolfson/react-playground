// Load in our dependencies
import assert from 'assert';

import _ from 'underscore';

import {Comment} from '../../../server/models/comment';
import {Post} from '../../../server/models/post';
import * as dbFixtures from './db-fixtures';

// Define our helpers
export const setFixtures = function (fixtureNames) {
  before(function setFixturesFn () {
    // Resolve our input fixtures
    let fixtures = fixtureNames.map(function resolveFixture (fixtureName) {
      // Look up our fixture
      let _fixture = dbFixtures[fixtureName];
      assert(_fixture, `Unable to find fixture by name "${fixtureName}"`);

      // Clone and return our fixture
      return _.clone(_fixture);
    });

    // Reset our existing models
    Comment.deleteAll();
    Post.deleteAll();

    // Install our fixtures
    fixtures.forEach(function installFixture (fixture) {
      if (fixture.model === 'post') {
        let post = new Post(fixture.attrs);
        post.save();
      } else if (fixture.model === 'comment') {
        let comment = new Comment(fixture.attrs);
        comment.save();
      } else {
        throw new Error(`Unidentified fixture model "${fixture.model}"`);
      }
    });
  });
};
