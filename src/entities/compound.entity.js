const Entity = require('mostly-entity');
const { BlobEntity } = require('playing-content-common');

const CompoundEntity = new Entity('Compound', {
  image: { using: BlobEntity }
});

CompoundEntity.discard('_id');

module.exports = CompoundEntity.freeze();
