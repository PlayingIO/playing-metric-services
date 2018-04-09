import assert from 'assert';
import makeDebug from 'debug';
import { Service, createService } from 'mostly-feathers-mongoose';
import fp from 'mostly-func';
import { plural } from 'pluralize';

import UserMetricModel from '../../models/user-metric.model';
import defaultHooks from './user-metric.hooks';
import { updateUserMetricValue, updateCompoundValues } from '../../helpers';

const debug = makeDebug('playing:user-metrics-services:user-metrics');

const defaultOptions = {
  name: 'user-metrics'
};

export class UserMetricService extends Service {
  constructor (options) {
    options = Object.assign({}, defaultOptions, options);
    super(options);
  }

  setup (app) {
    super.setup(app);
    this.hooks(defaultHooks(this.options));
  }

  /**
   * find user metrics of current user
   * @param {*} params
   */
  async find (params) {
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
    return this.first(null, null, params);
  }

  async create (data, params) {
    assert(data.metric, 'data.metric not provided.');
    assert(data.user, 'data.user not provided.');
    assert(data.verb, 'data.verb not provided.');
    assert(data.value, 'data.value not provided.');
    data.chance = parseInt(data.chance || 100);
    data.variables = data.variables || {};

    const svcMetrics = this.app.service(plural(data.type || 'metric'));
    const svcCompounds = this.app.service('compounds');

    const getMetric = (id) => svcMetrics.get(id);
    const getCompoundMetrics = () => svcCompounds.find({ paginate: false });
    const getUserMetrics = (user) => super.find({
      query: { user: data.user },
      paginate: false
    });
    const upsertUserMetrics = fp.map(metric => {
      return super.upsert(metric.id, metric, { query: {
        metric: metric.metric,
        user: data.user
      }});
    });

    const metric = await getMetric(data.metric);
    assert(metric, 'data.metric is not exists');
    if (metric.type === 'set') assert(data.item, 'data.item not provided for set metric');

    // value of the user metric
    let update = updateUserMetricValue(metric.type, data.verb, data.value, data.item, data.chance, data.variables);
    update = fp.merge(update, fp.pick(['metric', 'user', 'name', 'type', 'meta'], data));

    // upsert the user metric
    const result = await Promise.all(upsertUserMetrics([update]));

    // get user metrics for updating all compound metrics
    const [userScores, compoundMetrics] = await Promise.all([
      getUserMetrics(),
      getCompoundMetrics()
    ]);

    let userCompounds = fp.map(compound => {
      return {
        metric: compound.id,
        user: data.user,
        name: compound.name,
        type: compound.type,
        formula: compound.constraints && compound.constraints.formula || ''
      };
    }, compoundMetrics);
    userCompounds = updateCompoundValues(userCompounds, userScores);

    if (userCompounds.length > 0) {
      await Promise.all(upsertUserMetrics(userCompounds));
    }
    return result;
  }
}

export default function init (app, options, hooks) {
  options = Object.assign({ ModelName: 'user-metric' }, options);
  return createService(app, UserMetricService, UserMetricModel, options);
}

init.Service = UserMetricService;
