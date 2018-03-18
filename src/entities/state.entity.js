import Entity from 'mostly-entity';
import { entities as contents } from 'playing-content-services';

const StateEntity = new Entity('State', {
  image: { using: contents.BlobEntity },
  'constraints.states.image': { using: contents.BlobEntity }
});

StateEntity.excepts('updatedAt', 'destroyedAt');

export default StateEntity.asImmutable();
