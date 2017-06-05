// Load in our dependencies
import assert from 'assert';

import _ from 'underscore';
import uuidV4 from 'uuid/v4';

// Define our model backend
export class Comment {
  constructor(attrs) {
    this.id = attrs.id || uuidV4();
    this.content = attrs.content;
  }
  save() {
    Comment._modelsById[this.id] = this;
  }
}
Comment._modelsById = {};
Comment.getById = function (id) {
  return Comment._modelsById[id];
};
Comment.fetchById = function (id) {
  const comment = Comment.getById(id);
  assert(comment);
  return comment;
};
Comment.getAll = function () {
  return _.values(Comment._modelsById);
};
Comment.deleteAll = function () {
  Comment._modelsById = {};
};
