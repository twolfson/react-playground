// Load in our dependencies
const assert = require('assert');

const _ = require('underscore');
const httpErrors = require('http-errors');

// Define our model
module.exports = class Base {
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
  static fetchById(id) {
    const model = this.getById(id);
    assert(model);
    return model;
  }
  static fetchByIdOr404(id) {
    const model = this.getById(id);
    if (!model) { throw new httpErrors.NotFound(); }
    return model;
  }

  static deleteAll() {
    this._modelsById = {};
  }

  constructor(attrs) {
    // Do nothing by default
  }
  save() {
    const cls = this.constructor;
    cls._modelsById[this.id] = this;
  }
};
