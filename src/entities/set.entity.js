import Entity from 'mostly-entity';
import { BlobEntity } from 'playing-content-common';

const SetEntity = new Entity('Set', {
  image: { using: BlobEntity },
  'constraints.items.image': { using: BlobEntity }
});

SetEntity.excepts('updatedAt', 'destroyedAt');

export default SetEntity.asImmutable();
