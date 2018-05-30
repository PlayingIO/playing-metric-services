import Entity from 'mostly-entity';
import { BlobEntity } from 'playing-content-common';

const CompoundEntity = new Entity('Compound', {
  image: { using: BlobEntity }
});

CompoundEntity.excepts('updatedAt', 'destroyedAt');

export default CompoundEntity.asImmutable();
