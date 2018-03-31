import assert from 'assert';
import makeDebug from 'debug';
import { Service, createService } from 'mostly-feathers-mongoose';
import fp from 'mostly-func';

import StateModel from '../../models/state.model';
import defaultHooks from './state.hooks';

const debug = makeDebug('playing:metrics-services:states');

const defaultOptions = {
  name: 'states'
};

export class StateService extends Service {
  constructor (options) {
    options = Object.assign({}, defaultOptions, options);
    super(options);
  }

  setup (app) {
    super.setup(app);
    this.hooks(defaultHooks(this.options));
  }
}

export default function init (app, options, hooks) {
  options = Object.assign({ ModelName: 'state' }, options);
  return createService(app, StateService, StateModel, options);
}

init.Service = StateService;
