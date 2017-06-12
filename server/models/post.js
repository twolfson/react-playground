// Load in our dependencies
const assert = require('assert');

const _ = require('underscore');
const uuidV4 = require('uuid/v4');

const Base = require('./base');
const Comment = require('./comment');

// Define our model backend
class Post extends Base {
  static _modelsById = {};
  constructor(attrs) {
    super(attrs);
    this.id = attrs.id || uuidV4(); assert(this.id);
    this.content = attrs.content; assert(this.content);
  }
  addComment(attrs) {
    let comment = new Comment(_.defaults({
      postId: this.id
    }, attrs));
    return comment;
  }
  save() {
    const cls = this.constructor;
    cls._modelsById[this.id] = this;
  }
}
module.exports = Post;
