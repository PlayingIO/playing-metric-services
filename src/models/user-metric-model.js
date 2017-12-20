import timestamps from 'mongoose-timestamp';
import { plugins } from 'mostly-feathers-mongoose';

/*
 * User metrics (scores/levels/achievements/etc)
 */
const fields = {
  metric: { type: 'ObjectId', required: true }, // metric id
  name: { type: 'String', required: true },     // metric name (for cache)
  type: { type: 'String', required: true },     // metric type
  value: { type: 'Mixed' },                     // metric value
  meta: { type: 'Mixed' },                      // metric meta info
  user: { type: 'ObjectId', required: true }    // user id
};

export default function model (app, name) {
  const mongoose = app.get('mongoose');
  const schema = new mongoose.Schema(fields);
  schema.plugin(timestamps);
  schema.plugin(plugins.softDelete);
  schema.index({ metric: 1, user: 1 });
  return mongoose.model(name, schema);
}

model.schema = fields;