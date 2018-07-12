const { iff } = require('feathers-hooks-common');
const { associateCurrentUser, queryWithCurrentUser } = require('feathers-authentication-hooks');
const { hooks } = require('mostly-feathers-mongoose');
const { cache } = require('mostly-feathers-cache');
const { sanitize, validate } = require('mostly-feathers-validate');

const UserMetricEntity = require('../../entities/metric.entity');
const accepts = require('./user-metric.accepts');

module.exports = function (options = {}) {
  return {
    before: {
      all: [
        hooks.authenticate('jwt', options.auth),
        queryWithCurrentUser({ idField: 'id', as: 'user' }),
        cache(options.cache)
      ],
      create: [
        associateCurrentUser({ idField: 'id', as: 'user' }),
        sanitize(accepts),
        validate(accepts)
      ],
      update: [
        associateCurrentUser({ idField: 'id', as: 'user' }),
        hooks.discardFields('createdAt', 'updatedAt', 'destroyedAt')
      ],
      patch: [
        associateCurrentUser({ idField: 'id', as: 'user' }),
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
};