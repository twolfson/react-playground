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
