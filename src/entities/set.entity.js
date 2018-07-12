const Entity = require('mostly-entity');
const { BlobEntity } = require('playing-content-common');

const SetEntity = new Entity('Set', {
  image: { using: BlobEntity },
  'constraints.items.image': { using: BlobEntity }
});

SetEntity.discard('_id');

module.exports = SetEntity.freeze();
