const assert = require('assert');
const makeDebug = require('debug');
const { Service, createService } = require('mostly-feathers-mongoose');
const fp = require('mostly-func');

const StateModel = require('../../models/state.model');
const defaultHooks = require('./state.hooks');

const debug = makeDebug('playing:metrics-services:states');

const defaultOptions = {
  name: 'states'
};

class StateService extends Service {
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
  options = { ModelName: 'state', ...options };
  return createService(app, StateService, StateModel, options);
};
module.exports.Service = StateService;
