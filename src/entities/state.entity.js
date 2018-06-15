import Entity from 'mostly-entity';
import { BlobEntity } from 'playing-content-common';

const StateEntity = new Entity('State', {
  image: { using: BlobEntity },
  'constraints.states.image': { using: BlobEntity }
});

StateEntity.discard('_id');

export default StateEntity.asImmutable();
