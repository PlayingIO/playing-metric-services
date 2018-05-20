import { iff, isProvider } from 'feathers-hooks-common';
import { associateCurrentUser, queryWithCurrentUser } from 'feathers-authentication-hooks';
import { hooks } from 'mostly-feathers-mongoose';
import { cache } from 'mostly-feathers-cache';
import { sanitize, validate } from 'mostly-feathers-validate';

import UserMetricEntity from '../../entities/metric.entity';
import accepts from './user-metric.accepts';

export default function (options = {}) {
  return {
    before: {
      all: [
        hooks.authenticate('jwt', options.auth),
        iff(isProvider('external'),
          queryWithCurrentUser({ idField: 'id', as: 'user' })),
        cache(options.cache)
      ],
      create: [
        iff(isProvider('external'),
          associateCurrentUser({ idField: 'id', as: 'user' })),
        sanitize(accepts),
        validate(accepts)
      ],
      update: [
        iff(isProvider('external'),
          associateCurrentUser({ idField: 'id', as: 'user' })),
        hooks.discardFields('createdAt', 'updatedAt', 'destroyedAt')
      ],
      patch: [
        iff(isProvider('external'),
          associateCurrentUser({ idField: 'id', as: 'user' })),
        hooks.discardFields('createdAt', 'updatedAt', 'destroyedAt')
      ]
    },
    after: {
      all: [
        cache(options.cache),
        hooks.populate('metric', { path: '@type' }), // absolute path
        hooks.populate('user', { service: 'users' }),
        hooks.presentEntity(UserMetricEntity, options.entities),
        hooks.responder()
      ]
    }
  };
}