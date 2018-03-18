import assert from 'assert';
import makeDebug from 'debug';
import { Service, createService } from 'mostly-feathers-mongoose';
import fp from 'mostly-func';
import { plural } from 'pluralize';

import UserMetricModel from '~/models/user-metric.model';
import defaultHooks from './user-metric.hooks';
import { calculateMetricValue, updateCompoundMetrics } from '../../helpers';

const debug = makeDebug('playing:user-metrics-services:user-metrics');

const defaultOptions = {
  name: 'user-metrics'
};

class UserMetricService extends Service {
  constructor(options) {
    options = Object.assign({}, defaultOptions, options);
    super(options);
  }

  setup(app) {
    super.setup(app);
    this.hooks(defaultHooks(this.options));
  }

  /**
   * find user metrics of current user
   * @param {*} params
   */
  find(params) {
    params = Object.assign({ query: {} }, params);
    assert(params.query.user, 'params.query.user not provided');
    return super.find(params);
  }

  /**
   * get user metrics by action id
   */
  get (id, params) {
    let action = null;
    [id, action] = this._idOrAction(id, params);
    if (action) {
      return super._action('get', action, id, null, params);
    }

    params = Object.assign({ query: {} }, params);
    assert(params.query.user, 'params.query.user not provided');
    params.query.metric = params.query.metric || id;
    return this._first(null, null, params);
  }

  create (data, params) {
    assert(data.metric, 'data.metric not provided.');
    assert(data.user, 'data.user not provided.');
    assert(data.verb, 'data.verb not provided.');
    assert(data.value, 'data.value not provided.');
    data.chance = parseInt(data.chance || 100);

    const svcMetrics = this.app.service(plural(data.type || 'metric'));

    const getMetric = () => svcMetrics.get(data.metric);
    const getUserMetric = () => this._first({ query: {
      metric: data.metric, user: data.user
    }});
    const getUserMetrics = () => super.find({
      query: { user: data.user },
      paginate: false
    });
    const udpateUserMetrics = fp.map(userMetric => {
      return super.patch(userMetric.id, userMetric);
    });

    return Promise.all([
      getMetric(),
      getUserMetric()
    ]).then(([metric, userMetric]) => {
      assert(metric, 'data.metric not exists');
      if (metric.type === 'set') assert(data.item, 'data.item not provided for set metric');
      data.type = metric.type;
      data.name = metric.name;
      userMetric = userMetric || { metric: metric.id, type: metric.type };
      // TODO FIX if create is called in in parallel, value will be overwrited each other
      data.value = calculateMetricValue(userMetric, data.verb, data.value, data.item, data.chance, data.variables);
      return super._upsert(null, data, { query: {
        metric: data.metric,
        user: data.user
      }}).then(result => {
        // get user metrics for update compound metrics
        return getUserMetrics().then(userMetrics => {
          const userCompounds = updateCompoundMetrics(userMetrics);
          if (userCompounds.length > 0) {
            return Promise.all(udpateUserMetrics(userCompounds)).then(results => {
              return fp.concat([result], results || []);
            });
          } else {
            return result;
          }
        });
      });
    });
  }
}

export default function init(app, options, hooks) {
  options = Object.assign({ ModelName: 'user-metric' }, options);
  return createService(app, UserMetricService, UserMetricModel, options);
}

init.Service = UserMetricService;
