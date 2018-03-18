import Entity from 'mostly-entity';
import { entities as contents } from 'playing-content-services';

const PointEntity = new Entity('Point', {
  image: { using: contents.BlobEntity }
});

PointEntity.excepts('updatedAt', 'destroyedAt');

export default PointEntity.asImmutable();
