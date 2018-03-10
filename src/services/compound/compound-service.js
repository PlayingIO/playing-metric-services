import assert from 'assert';
import makeDebug from 'debug';
import { Service, createService } from 'mostly-feathers-mongoose';
import fp from 'mostly-func';
import CompoundModel from '~/models/compound-model';
import defaultHooks from './compound-hooks';

const debug = makeDebug('playing:metrics-services:compounds');

const defaultOptions = {
  name: 'compounds'
};

class CompoundService extends Service {
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
  options = Object.assign({ ModelName: 'compound' }, options);
  return createService(app, CompoundService, CompoundModel, options);
}

init.Service = CompoundService;
