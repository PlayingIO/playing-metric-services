const assert = require('assert');
const makeDebug = require('debug');
const { Service, helpers, createService } = require('mostly-feathers-mongoose');
const fp = require('mostly-func');
const { plural } = require('pluralize');

const MetricModel = require('../../models/metric.model');
const defaultHooks = require('./metric.hooks');

const debug = makeDebug('playing:metrics-services:metrics');

const defaultOptions = {
  name: 'metrics'
};

class MetricService extends Service {
  constructor (options) {
    options = fp.assignAll(defaultOptions, options);
    super(options);
  }

  setup (app) {
    super.setup(app);
    this.hooks(defaultHooks(this.options));
  }

  find (params = {}) {
    const type = params && fp.dotPath('query.type', params);
    if (fp.is(String, type) && type !== 'metric') {
      return this.app.service(plural(type)).find(params);
    } else {
      return super.find(params).then(result => {
        return helpers.discriminatedFind(this.app, 'metric', result, params, this.options);
      });
    }
  }

  get (id, params = {}) {
    const type = fp.dotPath('query.type', params);
    if (type && fp.is(String, type)) {
      return this.app.service(plural(type)).get(params);
    } else {
      return super.get(id, params).then(metric => {
        return helpers.discriminatedGet(this.app, 'metric', metric, params);
      });
    }
  }

  create (data, params = {}) {
    if (data.type && fp.is(String, data.type)) {
      return this.app.service(plural(data.type)).create(data, params);
    } else {
      return super.create(data, params);
    }
  }

  update (id, data, params = {}) {
    if (data.type && fp.is(String, data.type)) {
      return this.app.service(plural(data.type)).update(id, data, params);
    } else {
      return super.update(id, data, params);
    }
  }

  patch (id, data, params = {}) {
    if (data.type && fp.is(String, data.type)) {
      return this.app.service(plural(data.type)).patch(id, data, params);
    } else {
      return super.patch(id, data, params);
    }
  }

  remove (id, params = {}) {
    const type = fp.dotPath('query.type', params);
    if (type && fp.is(String, type)) {
      return this.app.service(plural(type)).remove(id, params);
    } else {
      const more = params && fp.dotPath('query.more', params);
      if (more) {
        const moreIds = [id].concat(more.split(','));
        delete params.query.more;
        return Promise.all(moreIds.map(id => super.remove(id, params)));
      } else {
        return super.remove(id, params);
      }
    }
  }
}

module.exports = function init (app, options, hooks) {
  options = { ModelName: 'metric', ...options };
  return createService(app, MetricService, MetricModel, options);
};
module.exports.Service = MetricService;
