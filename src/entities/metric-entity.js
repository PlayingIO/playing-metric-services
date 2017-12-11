import Entity from 'mostly-entity';
import { entities as contents } from 'playing-content-services';

const MetricEntity = new Entity('Metric', {
  image: { using: contents.BlobEntity }
});

MetricEntity.excepts('updatedAt', 'destroyedAt');

export default MetricEntity.asImmutable();
