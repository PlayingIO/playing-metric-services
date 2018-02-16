import assert from 'assert';
import makeDebug from 'debug';
import { Service, helpers, createService } from 'mostly-feathers-mongoose';
import fp from 'mostly-func';
import { plural } from 'pluralize';
import MetricModel from '~/models/metric-model';
import defaultHooks from './metric-hooks';

const debug = makeDebug('playing:metrics-services:metrics');

const defaultOptions = {
  name: 'metrics'
};

class MetricService extends Service {
  constructor(options) {
    options = Object.assign({}, defaultOptions, options);
    super(options);
  }

  setup(app) {
    super.setup(app);
    this.hooks(defaultHooks(this.options));
  }

  find(params) {
    if (typeof params.query.type === 'string' && params.query.type !== 'metric') {
      return this.app.service(plural(params.query.type)).find(params);
    } else {
      return super.find(params);
    }
  }

  get(id, params) {
    return super.get(id, params).then(metric => {
      if (metric && metric.type && metric.type !== 'metric') {
        let service = plural(metric.type || 'metric');
        return this.app.service(service).get(metric.id, params);
      } else {
        return metric;
      }
    });
  }

  create(data, params) {
    if (data.type && data.type !== 'metric') {
      return this.app.service(plural(data.type)).create(data, params);
    } else {
      return super.create(data, params);
    }
  }

  update(id, data, params) {
    if (data.type && data.type !== 'metric') {
      return this.app.service(plural(data.type)).update(id, data, params);
    } else {
      return super.update(id, data, params);
    }
  }

  patch(id, data, params) {
    if (data.type && data.type !== 'metric') {
      return this.app.service(plural(data.type)).patch(id, data, params);
    } else {
      return super.patch(id, data, params);
    }
  }

  remove(id, params) {
    if (params.query.type && params.query.type !== 'metric') {
      return this.app.service(plural(params.query.type)).remove(id, params);
    } else {
      if (params && params.query.more) {
        let more = [id].concat(params.query.more.split(','));
        delete params.query.more;
        return Promise.all(more.map(id => super.remove(id, params)));
      } else {
        return super.remove(id, params);
      }
    }
  }
}

export default function init(app, options, hooks) {
  options = Object.assign({ ModelName: 'metric' }, options);
  return createService(app, MetricService, MetricModel, options);
}

init.Service = MetricService;
