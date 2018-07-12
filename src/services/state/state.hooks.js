const { hooks } = require('mostly-feathers-mongoose');
const { cache } = require('mostly-feathers-cache');
const contents = require('playing-content-common');

const StateEntity = require('../../entities/state.entity');

module.exports = function (options = {}) {
  return {
    before: {
      all: [
        hooks.authenticate('jwt', options.auth),
        cache(options.cache)
      ],
      get: [],
      find: [],
      create: [
        contents.fetchBlobs({ xpath: 'image' })
      ],
      update: [
        contents.fetchBlobs({ xpath: 'image' }),
        hooks.discardFields('createdAt', 'updatedAt', 'destroyedAt')
      ],
      patch: [
        contents.fetchBlobs({ xpath: 'image' }),
        hooks.discardFields('createdAt', 'updatedAt', 'destroyedAt')
      ],
      remove: []
    },
    after: {
      all: [
        cache(options.cache),
        hooks.presentEntity(StateEntity, options.entities),
        hooks.responder()
      ]
    }
  };
};