const Entity = require('mostly-entity');
const { BlobEntity } = require('playing-content-common');

const MetricEntity = new Entity('Metric', {
  image: { using: BlobEntity }
});

MetricEntity.discard('_id');

module.exports = MetricEntity.freeze();
