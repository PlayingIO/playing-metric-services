import assert from 'assert';
import makeDebug from 'debug';
import { Service, helpers, createService } from 'mostly-feathers-mongoose';
import fp from 'mostly-func';
import UserMetricModel from '~/models/user-metric-model';
import defaultHooks from './user-metric-hooks';

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
}

export default function init(app, options, hooks) {
  options = Object.assign({ ModelName: 'user-metric' }, options);
  return createService(app, UserMetricService, UserMetricModel, options);
}

init.Service = UserMetricService;
