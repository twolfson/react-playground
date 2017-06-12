// Load in our dependencies
const assert = require('assert');
const _ = require('underscore');

const config = require('../_config');
const Comment = require('./comment');
const Post = require('./post');

// Define a location to save fixtures
const dbFixtures = {};

// Define fixture managment functions
const fixtureStrToModel = {
  'post': Post,
  'comment': Comment
};
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
    const Model = fixtureStrToModel[fixture.model];
    assert(Model, `Unidentified fixture model "${fixture.model}"`);
    // DEV: If we need one-off support for options to models, then do `if/else` logic here
    let model = new Model(fixture.attrs);
    model.save();
  });
};

// Define fixture registration functions
function addFixture(key, modelName, attrs) {
  assert.notEqual(dbFixtures.key, undefined, `Fixture ${key} is already defined`);
  assert(fixtureStrToModel[modelName], `Unidentified model ${modelName}. Please double check the model's spelling`);
  dbFixtures[key] = {
    model: modelName,
    attrs: attrs
  };
  return key;
}

// Define our fixtures
addFixture('post', 'post', {
  id: 'example-post-uuid',
  content: 'This is an example post'
});
addFixture('post--another', 'post', {
  id: 'example-post-another-uuid',
  content: 'This is another example post'
});
addFixture('comment', 'comment', {
  id: 'example-comment-uuid',
  postId: 'example-post-uuid',
  content: 'This is an example comment'
});
addFixture('comment--another', 'comment', {
  id: 'example-comment-another-uuid',
  postId: 'example-post-uuid',
  content: 'This is another example comment'
});

// If we are providing a set of default mocks, then load them up
// DEV: It would be ideal to load mocks on a per-request basis in controllers
//   but that's a loooot more work
if (config.loadDefaultFixtures) {
  exports.setFixtures(['post', 'post--another', 'comment', 'comment--another']);
}
