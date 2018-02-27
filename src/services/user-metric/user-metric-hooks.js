import { iff, isProvider, discard } from 'feathers-hooks-common';
import { hooks as auth } from 'feathers-authentication';
import { associateCurrentUser, queryWithCurrentUser } from 'feathers-authentication-hooks';
import { hooks } from 'mostly-feathers-mongoose';
import UserMetricEntity from '~/entities/metric-entity';

module.exports = function(options = {}) {
  return {
    before: {
      all: [
        auth.authenticate('jwt'),
        iff(isProvider('external'),
          queryWithCurrentUser({ idField: 'id', as: 'user' }))
      ],
      find: [
        hooks.prefixSelect('workout', { excepts: ['games', 'insights']})
      ],
      get: [
        hooks.prefixSelect('workout', { excepts: ['games', 'insights']})
      ],
      create: [
        iff(isProvider('external'),
          associateCurrentUser({ idField: 'id', as: 'user' })),
      ],
      update: [
        iff(isProvider('external'),
          associateCurrentUser({ idField: 'id', as: 'user' })),
      ],
      patch: [
        iff(isProvider('external'),
          associateCurrentUser({ idField: 'id', as: 'user' })),
      ]
    },
    after: {
      all: [
        hooks.populate('metric', { path: '@type' }), // absolute path
        hooks.populate('user', { service: 'users' }),
        hooks.presentEntity(UserMetricEntity, options),
        hooks.responder()
      ]
    }
  };
};