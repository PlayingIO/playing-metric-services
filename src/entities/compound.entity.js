import Entity from 'mostly-entity';
import { BlobEntity } from 'playing-content-common';

const CompoundEntity = new Entity('Compound', {
  image: { using: BlobEntity }
});

CompoundEntity.excepts('_id');

export default CompoundEntity.asImmutable();
