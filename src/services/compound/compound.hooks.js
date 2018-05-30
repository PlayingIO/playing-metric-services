import { hooks } from 'mostly-feathers-mongoose';
import { cache } from 'mostly-feathers-cache';
import contents from 'playing-content-common';

import CompoundEntity from '../../entities/compound.entity';

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
        hooks.presentEntity(CompoundEntity, options.entities),
        hooks.responder()
      ]
    }
  };
}