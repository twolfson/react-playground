// Load in our dependencies
const config = require('../_config');

// Define our fixtures
exports['example-post'] = {
  model: 'post',
  attrs: {
    id: 'example-post',
    content: 'This is an example post'
  }
};
exports['example-post2'] = {
  model: 'post',
  attrs: {
    id: 'example-post2',
    content: 'This is another example post'
  }
};

exports['comment--example'] = {
  model: 'comment',
  attrs: {
    id: 'example-comment',
    postId: 'example-post',
    content: 'This is an example comment'
  }
};
exports['comment--example2'] = {
  model: 'comment',
  attrs: {
    id: 'example-comment2',
    postId: 'example-post',
    content: 'This is another example comment'
  }
};

// If we are providing a set of default mocks, then load them up
// DEV: It would be ideal to load mocks on a per-request basis in controllers
//   but that's a loooot more work
if (config.loadDefaultFixtures) {
  // TODO: Add model loading
}
