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
    const type = params && fp.dotPath('query.type', params);
    if (fp.is(String, type) && type !== 'metric') {
      return this.app.service(plural(type)).find(params);
    } else {
      return super.find(params).then(result => {
        if (result && result.data && result.data.length > 0) {
          const metricsByType = fp.groupBy(fp.prop('type'), result.data);
          const findByType = fp.mapObjIndexed((metrics, type) => {
            if (type === 'metric') {
              return Promise.resolve(metrics);
            } else {
              const paramsIds = fp.assocDotPath('query.id', {
                $in: fp.map(fp.prop('id'), metrics)
              }, params);
              return this.app.service(plural(type)).find(paramsIds);
            }
          });
          const promises = fp.values(findByType(metricsByType));
          return Promise.all(promises).then(metrics => {
            result.data = fp.flatten(
              fp.map(doc => (doc && doc.data) || doc, metrics));
            const sort = params && fp.dotPath('query.$sort', params) || this.options.sort;
            if (sort) {
              result.data = helpers.sortWith(sort, result.data);
            }
            return result;
          });
        } else {
          return result;
        }
      });
    }
  }

  get(id, params) {
    const type = fp.dotPath('query.type', params);
    if (fp.is(String, type) && type !== 'metric') {
      return this.app.service(plural(type)).get(params);
    } else {
      return super.get(id, params).then(metric => {
        if (metric && metric.type && metric.type !== 'metric') {
          const service = plural(metric.type || 'metric');
          return this.app.service(service).get(metric.id, params);
        } else {
          return metric;
        }
      });
    }
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
    const type = params && fp.dotPath('query.type', params);
    if (fp.is(String, type) && type !== 'metric') {
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

export default function init(app, options, hooks) {
  options = Object.assign({ ModelName: 'metric' }, options);
  return createService(app, MetricService, MetricModel, options);
}

init.Service = MetricService;
