import assert from 'assert';
import makeDebug from 'debug';
import { Service, createService } from 'mostly-feathers-mongoose';
import fp from 'mostly-func';
import { plural } from 'pluralize';

import UserMetricModel from '~/models/user-metric.model';
import defaultHooks from './user-metric.hooks';
import { updateUserMetricValue, updateCompoundMetrics } from '../../helpers';

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
  async find(params) {
    params = Object.assign({ query: {} }, params);
    assert(params.query.user, 'params.query.user not provided');
    return super.find(params);
  }

  /**
   * get user metrics by action id
   */
  async get (id, params) {
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

  async create (data, params) {
    assert(data.metric, 'data.metric not provided.');
    assert(data.user, 'data.user not provided.');
    assert(data.verb, 'data.verb not provided.');
    assert(data.value, 'data.value not provided.');
    data.chance = parseInt(data.chance || 100);

    const svcMetrics = this.app.service(plural(data.type || 'metric'));

    const getMetric = (id) => svcMetrics.get(id);
    const getUserMetrics = (user) => super.find({
      query: { user: data.user },
      paginate: false
    });
    const udpateUserMetrics = fp.map(userMetric => {
      return super.patch(userMetric.id, userMetric);
    });

    const metric = await getMetric(data.metric);
    assert(metric, 'data.metric is not exists');
    if (metric.type === 'set') assert(data.item, 'data.item not provided for set metric');

    // value of the user metric
    let update = updateUserMetricValue(metric.type, data.verb, data.value, data.item, data.chance, data.variables);
    update = fp.merge(update, fp.pick(['metric', 'user', 'name', 'type', 'meta'], data));

    // upsert the user metric
    const result = await super._upsert(null, update, { query: {
      metric: data.metric,
      user: data.user
    }});

    // get user metrics for updating all compound metrics
    const userMetrics = await getUserMetrics();
    const userCompounds = updateCompoundMetrics(userMetrics);
    if (userCompounds.length > 0) {
      const results = await Promise.all(udpateUserMetrics(userCompounds));
      return fp.concat([result], results || []);
    } else {
      return result;
    }
  }
}

export default function init(app, options, hooks) {
  options = Object.assign({ ModelName: 'user-metric' }, options);
  return createService(app, UserMetricService, UserMetricModel, options);
}

init.Service = UserMetricService;
