// Load in our dependencies
import assert from 'assert';

import _ from 'underscore';
import uuidV4 from 'uuid/v4';

// Define our model backend
export class Comment {
  constructor(attrs) {
    this.id = attrs.id || uuidV4(); assert(this.id);
    this.postId = attrs.postId; assert(this.postId);
    this.content = attrs.content; assert(this.content);
  }
  save() {
    Comment._modelsById[this.id] = this;
  }
}
Comment._modelsById = {};
Comment.getById = function (id) {
  return Comment._modelsById[id];
};
Comment.getAll = function (filterAttrs) {
  let comments = _.values(Comment._modelsById);
  if (filterAttrs) {
    comments = _.where(comments, filterAttrs);
  }
  return comments;
};
Comment.deleteAll = function () {
  Comment._modelsById = {};
};
