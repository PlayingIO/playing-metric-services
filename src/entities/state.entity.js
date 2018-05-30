import Entity from 'mostly-entity';
import { BlobEntity } from 'playing-content-common';

const StateEntity = new Entity('State', {
  image: { using: BlobEntity },
  'constraints.states.image': { using: BlobEntity }
});

StateEntity.excepts('updatedAt', 'destroyedAt');

export default StateEntity.asImmutable();
