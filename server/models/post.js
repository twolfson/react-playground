// Load in our dependencies
import assert from 'assert';

import _ from 'underscore';
import httpErrors from 'http-errors';
import uuidV4 from 'uuid/v4';

// Define our model backend
export class Post {
  constructor(attrs) {
    this.id = attrs.id || uuidV4(); assert(this.id);
    this.content = attrs.content; assert(this.content);
  }
  save() {
    Post._modelsById[this.id] = this;
  }
}
Post._modelsById = {};
Post.getById = function (id) {
  return Post._modelsById[id];
};
Post.fetchByIdOr404 = function (id) {
  const post = Post.getById(id);
  if (!post) { throw new httpErrors.NotFound(); }
  return post;
};
Post.getAll = function () {
  return _.values(Post._modelsById);
};
Post.deleteAll = function () {
  Post._modelsById = {};
};
