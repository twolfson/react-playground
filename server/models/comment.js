// Load in our dependencies
import assert from 'assert';

import _ from 'underscore';
import uuidV4 from 'uuid/v4';

// Define our model backend
export class Comment {
  static _modelsById = {};
  static getById(id) {
    return this._modelsById[id];
  }
  static getAll(filterAttrs) {
    let comments = _.values(this._modelsById);
    // DEV: We could perform this more efficiently with another map by attributes we care about
    //   similar to an index but this is good enough for our playground
    if (filterAttrs) {
      comments = _.where(comments, filterAttrs);
    }
    return comments;
  }
  static deleteAll() {
    this._modelsById = {};
  }

  constructor(attrs) {
    this.id = attrs.id || uuidV4(); assert(this.id);
    this.postId = attrs.postId; assert(this.postId);
    this.content = attrs.content; assert(this.content);
  }
  save() {
    const cls = this.constructor;
    cls._modelsById[this.id] = this;
  }
}
