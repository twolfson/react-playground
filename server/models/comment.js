// Load in our dependencies
import assert from 'assert';

import uuidV4 from 'uuid/v4';

import {Base} from './base';

// Define our model backend
export class Comment extends Base {
  static _modelsById = {};
  constructor(attrs) {
    super(attrs);
    this.id = attrs.id || uuidV4(); assert(this.id);
    this.postId = attrs.postId; assert(this.postId);
    this.content = attrs.content; assert(this.content);
  }
}

// If we want to serve mock data, then load it up
// TODO: Move to config for `if`
// TODO: Relocate into fixture file
if (true) {
  Comment._modelsById['example-comment'] = {
    id: 'example-comment',
    content: 'This is an example comment'
  };
  Comment._modelsById['example-comment2'] = {
    id: 'example-comment2',
    content: 'This is another example comment'
  };
}
