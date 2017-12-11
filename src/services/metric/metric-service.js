import assert from 'assert';
import makeDebug from 'debug';
import { Service, helpers, createService } from 'mostly-feathers-mongoose';
import fp from 'mostly-func';
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
}

export default function init(app, options, hooks) {
  options = Object.assign({ ModelName: 'metric' }, options);
  return createService(app, MetricService, MetricModel, options);
}

init.Service = MetricService;
