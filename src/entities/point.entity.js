const Entity = require('mostly-entity');
const { BlobEntity } = require('playing-content-common');

const PointEntity = new Entity('Point', {
  image: { using: BlobEntity }
});

PointEntity.discard('_id');

module.exports = PointEntity.freeze();
