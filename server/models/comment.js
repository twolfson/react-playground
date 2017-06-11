// Load in our dependencies
const assert = require('assert');

const uuidV4 = require('uuid/v4');

const Base = require('./base');

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
