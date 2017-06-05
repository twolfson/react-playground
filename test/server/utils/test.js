// Load in our dependencies
import {posts, postsById} from '../../../server/models/post';

// Define our helpers
export const setFixtures = function (fixtureNames) {
  before(function setFixturesFn () {
    // Reset our existing models
    posts.length = 0;
    Object.keys(postsById).forEach(function removePostById (id) {
      delete post[id];
    });
  });
};
