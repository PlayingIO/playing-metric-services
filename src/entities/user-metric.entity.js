import Entity from 'mostly-entity';

const UserMetricEntity = new Entity('UserMetric');

UserMetricEntity.discard('_id');

export default UserMetricEntity.asImmutable();
