import Entity from 'mostly-entity';
import { entities as contents } from 'playing-content-services';

const CompoundEntity = new Entity('Compound', {
  image: { using: contents.BlobEntity }
});

CompoundEntity.excepts('updatedAt', 'destroyedAt');

export default CompoundEntity.asImmutable();
