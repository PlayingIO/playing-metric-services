const assert = require('assert');
const makeDebug = require('debug');
const { Service, createService } = require('mostly-feathers-mongoose');
const fp = require('mostly-func');

const SetModel = require('../../models/set.model');
const defaultHooks = require('./set.hooks');

const debug = makeDebug('playing:metrics-services:sets');

const defaultOptions = {
  name: 'sets'
};

class SetService extends Service {
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
  options = { ModelName: 'set', ...options };
  return createService(app, SetService, SetModel, options);
};
module.exports.Service = SetService;
