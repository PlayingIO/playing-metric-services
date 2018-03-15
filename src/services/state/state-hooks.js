import { hooks } from 'mostly-feathers-mongoose';
import { hooks as content } from 'playing-content-services';
import StateEntity from '~/entities/state-entity';

module.exports = function(options = {}) {
  return {
    before: {
      all: [
        hooks.authenticate('jwt', options.auth)
      ],
      get: [],
      find: [],
      create: [
        content.fetchBlobs({ xpath: 'image' })
      ],
      update: [
        content.fetchBlobs({ xpath: 'image' }),
        hooks.discardFields('id', 'createdAt', 'updatedAt', 'destroyedAt')
      ],
      patch: [
        content.fetchBlobs({ xpath: 'image' }),
        hooks.discardFields('id', 'createdAt', 'updatedAt', 'destroyedAt')
      ],
      remove: []
    },
    after: {
      all: [
        hooks.presentEntity(StateEntity, options),
        hooks.responder()
      ]
    }
  };
};