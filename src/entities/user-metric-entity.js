import Entity from 'mostly-entity';

const UserMetricEntity = new Entity('UserMetric');

UserMetricEntity.excepts('updatedAt', 'destroyedAt');

export default UserMetricEntity.asImmutable();
