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
  post: Post,
  comment: Comment
};
exports.deleteAll = function () {
  // Reset our existing models
  Comment.deleteAll();
  Post.deleteAll();
};
exports.setFixtures = function (fixtureNames) {
  // Resolve our input fixtures
  let fixtures = _.flatten(fixtureNames).map(function resolveFixture (fixtureName) {
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
  assert.strictEqual(dbFixtures[key], undefined, `Fixture ${key} is already defined`);
  assert(fixtureStrToModel[modelName], `Unidentified model ${modelName}. Please double check the model's spelling`);
  dbFixtures[key] = {
    model: modelName,
    attrs: attrs
  };
  return key;
}
function addPost(key, attrs) { return addFixture(key, 'post', attrs); }
function addComment(key, attrs) { return addFixture(key, 'comment', attrs); }

// Define our fixtures
const POST_ID = 'example-post-uuid';
exports.POST_WITH_COMMENT = [
  exports.POST = addPost('post', {
    id: POST_ID,
    content: 'This is an example post'
  }),
  addComment('comment', {
    id: 'example-comment-uuid',
    postId: POST_ID,
    content: 'This is an example comment'
  })
];
exports.POST_WITH_COMMENTS = _.flatten(exports.POST_WITH_COMMENT, [
  addComment('comment--another', {
    id: 'example-comment-another-uuid',
    postId: POST_ID,
    content: 'This is another example comment'
  })
]);
exports.POST_ANOTHER = addPost('post--another', {
  id: 'example-post-another-uuid',
  content: 'This is another example post'
});

// If we are providing a set of default mocks, then load them up
// DEV: It would be ideal to load mocks on a per-request basis in controllers
//   but that's a loooot more work
if (config.loadDefaultFixtures) {
  exports.setFixtures([exports.POST_WITH_COMMENTS, exports.POST_ANOTHER]);
}
