import Entity from 'mostly-entity';
import { BlobEntity } from 'playing-content-common';

const PointEntity = new Entity('Point', {
  image: { using: BlobEntity }
});

PointEntity.excepts('_id');

export default PointEntity.asImmutable();
