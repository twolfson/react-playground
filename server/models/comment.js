// Load in our dependencies
import assert from 'assert';

import _ from 'underscore';
import uuidV4 from 'uuid/v4';

// Define our model backend
export class Comment {
  constructor(attrs) {
    this.id = attrs.id || uuidV4(); assert(this.id);
    // Foreign key: this.postId
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
Comment.getAll = function () {
  return _.values(Comment._modelsById);
};
Comment.deleteAll = function () {
  Comment._modelsById = {};
};
