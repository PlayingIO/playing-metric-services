const assert = require('assert');
const makeDebug = require('debug');
const { Service, createService } = require('mostly-feathers-mongoose');
const fp = require('mostly-func');

const CompoundModel = require('../../models/compound.model');
const defaultHooks = require('./compound.hooks');

const debug = makeDebug('playing:metrics-services:compounds');

const defaultOptions = {
  name: 'compounds'
};

class CompoundService extends Service {
  constructor (options) {
    options = fp.assignAll(defaultOptions, options);
    super(options);
  }

  setup (app) {
    super.setup(app);
    this.hooks(defaultHooks(this.options));
  }
}

module.exports = function init (app, options, hooks) {
  options = { ModelName: 'compound', ...options };
  return createService(app, CompoundService, CompoundModel, options);
};
module.exports.Service = CompoundService;
