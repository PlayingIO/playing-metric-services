const Entity = require('mostly-entity');

const UserMetricEntity = new Entity('UserMetric');

UserMetricEntity.discard('_id');

module.exports = UserMetricEntity.freeze();
