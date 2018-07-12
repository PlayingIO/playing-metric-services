const assert = require('assert');
const makeDebug = require('debug');
const { Service, createService } = require('mostly-feathers-mongoose');
const fp = require('mostly-func');

const PointModel = require('../../models/point.model');
const defaultHooks = require('./point.hooks');

const debug = makeDebug('playing:metrics-services:points');

const defaultOptions = {
  name: 'points'
};

class PointService extends Service {
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
  options = { ModelName: 'point', ...options };
  return createService(app, PointService, PointModel, options);
};
module.exports.Service = PointService;
