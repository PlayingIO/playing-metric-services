import Entity from 'mostly-entity';

const UserMetricEntity = new Entity('UserMetric');

UserMetricEntity.excepts('_id');

export default UserMetricEntity.asImmutable();
