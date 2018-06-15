import Entity from 'mostly-entity';
import { BlobEntity } from 'playing-content-common';

const MetricEntity = new Entity('Metric', {
  image: { using: BlobEntity }
});

MetricEntity.discard('_id');

export default MetricEntity.asImmutable();
