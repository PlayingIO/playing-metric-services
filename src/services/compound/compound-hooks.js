import { hooks as auth } from 'feathers-authentication';
import { hooks } from 'mostly-feathers-mongoose';
import { hooks as content } from 'playing-content-services';
import CompoundEntity from '~/entities/compound-entity';

module.exports = function(options = {}) {
  return {
    before: {
      all: [
        auth.authenticate('jwt')
      ],
      get: [],
      find: [],
      create: [
        content.fetchBlobs({ xpath: 'image' })
      ],
      update: [
        content.fetchBlobs({ xpath: 'image' })
      ],
      patch: [
        content.fetchBlobs({ xpath: 'image' })
      ],
      remove: [],
    },
    after: {
      all: [
        hooks.presentEntity(CompoundEntity, options),
        hooks.responder()
      ]
    }
  };
};