import assert from 'assert';
import makeDebug from 'debug';
import { Service, helpers, createService } from 'mostly-feathers-mongoose';
import fp from 'mostly-func';
import PointModel from '~/models/point-model';
import defaultHooks from './point-hooks';

const debug = makeDebug('playing:metrics-services:points');

const defaultOptions = {
  name: 'points'
};

class PointService extends Service {
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
  options = Object.assign({ ModelName: 'point' }, options);
  return createService(app, PointService, PointModel, options);
}

init.Service = PointService;
