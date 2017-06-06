// Load in our dependencies
import assert from 'assert';

import _ from 'underscore';
import httpErrors from 'http-errors';
import uuidV4 from 'uuid/v4';

import {Comment} from './comment';

// Define our model backend
export class Post {
  static _modelsById = {};
  static getById(id) {
    return this._modelsById[id];
  }
  static fetchById(id) {
    const post = this.getById(id);
    assert(post);
    return post;
  }
  static fetchByIdOr404(id) {
    const post = this.getById(id);
    if (!post) { throw new httpErrors.NotFound(); }
    return post;
  }
  static getAll() {
    return _.values(this._modelsById);
  }
  static deleteAll() {
    this._modelsById = {};
  }

  constructor(attrs) {
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
