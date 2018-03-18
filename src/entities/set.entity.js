import Entity from 'mostly-entity';
import { entities as contents } from 'playing-content-services';

const SetEntity = new Entity('Set', {
  image: { using: contents.BlobEntity },
  'constraints.items.image': { using: contents.BlobEntity }
});

SetEntity.excepts('updatedAt', 'destroyedAt');

export default SetEntity.asImmutable();
