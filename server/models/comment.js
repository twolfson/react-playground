// Load in our dependencies
const assert = require('assert');

const uuidV4 = require('uuid/v4');

const Base = require('./base');
const config = require('../_config');

// Define our model backend
module.exports = class Comment extends Base {
  static _modelsById = {};
  constructor(attrs) {
    super(attrs);
    this.id = attrs.id || uuidV4(); assert(this.id);
    this.postId = attrs.postId; assert(this.postId);
    this.content = attrs.content; assert(this.content);
  }
};

// If we want to serve mock data, then load it up
// TODO: Relocate into fixture file (see `post.js` for more details)
if (config.loadMocks) {
  Comment._modelsById['example-comment'] = {
    id: 'example-comment',
    postId: 'example-post',
    content: 'This is an example comment'
  };
  Comment._modelsById['example-comment2'] = {
    id: 'example-comment2',
    postId: 'example-post',
    content: 'This is another example comment'
  };
}
