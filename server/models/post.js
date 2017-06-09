// Load in our dependencies
import assert from 'assert';

import _ from 'underscore';
import uuidV4 from 'uuid/v4';

import {Base} from './base';
import {Comment} from './comment';

// Define our model backend
export class Post extends Base {
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

// If we want to serve mock data, then load it up
// TODO: Move to config for `if`
// TODO: Relocate into fixture file
if (true) {
  Post._modelsById['example-post'] = {
    id: 'example-post',
    content: 'This is an example post'
  };
  Post._modelsById['example-post2'] = {
    id: 'example-post2',
    content: 'This is another example post'
  };
}
