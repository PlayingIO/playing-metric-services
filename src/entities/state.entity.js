const Entity = require('mostly-entity');
const { BlobEntity } = require('playing-content-common');

const StateEntity = new Entity('State', {
  image: { using: BlobEntity },
  'constraints.states.image': { using: BlobEntity }
});

StateEntity.discard('_id');

module.exports = StateEntity.freeze();
