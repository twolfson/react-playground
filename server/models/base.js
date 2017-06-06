// Load in our dependencies
import _ from 'underscore';

// Define our model
export class Base {
  // DEV: Separate models must implement their own `_modelsById` to prevent mixing classes accidentally
  static getById(id) {
    return this._modelsById[id];
  }
  static getAll(filterAttrs) {
    let models = _.values(this._modelsById);
    // DEV: We could perform this more efficiently with another map by attributes we care about
    //   similar to an index but this is good enough for our playground
    if (filterAttrs) {
      models = _.where(models, filterAttrs);
    }
    return models;
  }
  static deleteAll() {
    this._modelsById = {};
  }

  save() {
    const cls = this.constructor;
    cls._modelsById[this.id] = this;
  }
}
