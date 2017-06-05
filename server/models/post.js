// Load in our dependencies
import assert from 'assert';

import _ from 'underscore';
import httpErrors from 'http-errors';
import uuidV4 from 'uuid/v4';

import {Comment} from './comment';

// Define our model backend
export class Post {
  constructor(attrs) {
    this.id = attrs.id || uuidV4(); assert(this.id);
    this.content = attrs.content; assert(this.content);
    this.commentIds = [];
  }
  addComment(attrs) {
    let comment = new Comment(attrs);
    this.commentIds.push(comment.id);
    return comment;
  }
  save() {
    Post._modelsById[this.id] = this;
  }
}
Post._modelsById = {};
Post.getById = function (id) {
  return Post._modelsById[id];
};
Post.fetchById = function (id) {
  const post = Post.getById(id);
  assert(post);
  return post;
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
