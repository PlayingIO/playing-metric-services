import assert from 'assert';
import makeDebug from 'debug';
import { Service, createService } from 'mostly-feathers-mongoose';
import fp from 'mostly-func';

import SetModel from '../../models/set.model';
import defaultHooks from './set.hooks';

const debug = makeDebug('playing:metrics-services:sets');

const defaultOptions = {
  name: 'sets'
};

export class SetService extends Service {
  constructor (options) {
    options = fp.assign(defaultOptions, options);
    super(options);
  }

  setup (app) {
    super.setup(app);
    this.hooks(defaultHooks(this.options));
  }
}

export default function init (app, options, hooks) {
  options = { ModelName: 'set', ...options };
  return createService(app, SetService, SetModel, options);
}

init.Service = SetService;
