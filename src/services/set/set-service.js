import assert from 'assert';
import makeDebug from 'debug';
import { Service, helpers, createService } from 'mostly-feathers-mongoose';
import fp from 'mostly-func';
import SetModel from '~/models/set-model';
import defaultHooks from './set-hooks';

const debug = makeDebug('playing:metrics-services:sets');

const defaultOptions = {
  name: 'sets'
};

class SetService extends Service {
  constructor(options) {
    options = Object.assign({}, defaultOptions, options);
    super(options);
  }

  setup(app) {
    super.setup(app);
    this.hooks(defaultHooks(this.opƒtions));
  }
}

export default function init(app, options, hooks) {
  options = Object.assign({ ModelName: 'set' }, options);
  return createService(app, SetService, SetModel, options);
}

init.Service = SetService;
