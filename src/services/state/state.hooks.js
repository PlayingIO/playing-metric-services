import { hooks } from 'mostly-feathers-mongoose';
import { cache } from 'mostly-feathers-cache';
import contents from 'playing-content-common';

import StateEntity from '../../entities/state.entity';

export default function (options = {}) {
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
}