import assert from 'assert';
import makeDebug from 'debug';
import { Service, createService } from 'mostly-feathers-mongoose';
import fp from 'mostly-func';
import { plural } from 'pluralize';

import UserMetricModel from '../../models/user-metric.model';
import defaultHooks from './user-metric.hooks';
import { calcUserMetricChange, deltaUserMetric, updateCompoundValues } from '../../helpers';

const debug = makeDebug('playing:metrics-services:user-metrics');

const defaultOptions = {
  name: 'user-metrics'
};

export class UserMetricService extends Service {
  constructor (options) {
    options = fp.assignAll(defaultOptions, options);
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
    params = { query: {}, ...params };
    assert(params.query.user, 'query.user not provided');
    return super.find(params);
  }

  /**
   * get user metrics by metric id
   */
  async get (id, params) {
    params = { query: {}, ...params };
    assert(params.query.user, 'query.user not provided');
    params.query.metric = params.query.metric || id;
    return this.first(params);
  }

  async create (data, params) {
    const svcMetrics = this.app.service(plural(data.type || 'metric'));
    const svcCompounds = this.app.service('compounds');

    const getMetric = (id) => svcMetrics.get(id);
    const getCompoundMetrics = () => svcCompounds.find({ paginate: false });
    const getUserMetric = (user, metric) => super.first({
      query: { user, metric }
    });
    const getUserMetrics = (user) => super.find({
      query: { user }, paginate: false
    });
    const upsertUserMetric = (user, metric) => super.upsert(metric.id, metric,
      { query: { user, metric: metric.metric } });
    const upsertUserMetrics = (user, metrics) => fp.map(metric =>
      upsertUserMetric(user, metric), metrics);

    const metric = await getMetric(data.metric);
    assert(metric, 'metric is not exists');
    if (metric.type === 'set') assert(data.item, 'item not provided for set metric');

    // value of the user metric
    let update = calcUserMetricChange(metric.type, data.verb, data.value, data.item, data.chance, data.variables);
    update = fp.merge(update, fp.pick(['metric', 'user', 'name', 'type', 'meta'], data));

    // upsert the user metric
    const old = await getUserMetric(data.user, data.metric);
    const result = await upsertUserMetric(data.user, update);
    result.delta = deltaUserMetric(old, result, update);

    // get user metrics for updating all compound metrics
    const [userScores, compoundMetrics] = await Promise.all([
      getUserMetrics(data.user),
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
      await Promise.all(upsertUserMetrics(data.user, userCompounds));
    }
    return result;
  }
}

export default function init (app, options, hooks) {
  options = { ModelName: 'user-metric', ...options };
  return createService(app, UserMetricService, UserMetricModel, options);
}

init.Service = UserMetricService;
