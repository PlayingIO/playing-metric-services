import Entity from 'mostly-entity';
import { BlobEntity } from 'playing-content-common';

const MetricEntity = new Entity('Metric', {
  image: { using: BlobEntity }
});

MetricEntity.excepts('updatedAt', 'destroyedAt');

export default MetricEntity.asImmutable();
