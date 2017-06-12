// Load in our dependencies
const assert = require('assert');
const _ = require('underscore');

const config = require('../_config');
const Comment = require('./comment');
const Post = require('./post');

// Define a location to save fixtures
const dbFixtures = {};

// Define fixture managment functions
exports.deleteAll = function () {
  // Reset our existing models
  Comment.deleteAll();
  Post.deleteAll();
};
exports.setFixtures = function (fixtureNames) {
  // Resolve our input fixtures
  let fixtures = fixtureNames.map(function resolveFixture (fixtureName) {
    // Look up our fixture
    let _fixture = dbFixtures[fixtureName];
    assert(_fixture, `Unable to find fixture by name "${fixtureName}"`);

    // Clone and return our fixture
    return _.clone(_fixture);
  });

  exports.deleteAll();

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
};

// Define our fixtures
dbFixtures.post = {
  model: 'post',
  attrs: {
    id: 'example-post-uuid',
    content: 'This is an example post'
  }
};
dbFixtures['post--another'] = {
  model: 'post',
  attrs: {
    id: 'example-post-another-uuid',
    content: 'This is another example post'
  }
};
dbFixtures.comment = {
  model: 'comment',
  attrs: {
    id: 'example-comment-uuid',
    postId: 'example-post-uuid',
    content: 'This is an example comment'
  }
};
dbFixtures['comment--another'] = {
  model: 'comment',
  attrs: {
    id: 'example-comment-another-uuid',
    postId: 'example-post-uuid',
    content: 'This is another example comment'
  }
};

// If we are providing a set of default mocks, then load them up
// DEV: It would be ideal to load mocks on a per-request basis in controllers
//   but that's a loooot more work
if (config.loadDefaultFixtures) {
  exports.setFixtures(['post', 'post--another', 'comment', 'comment--another']);
}
