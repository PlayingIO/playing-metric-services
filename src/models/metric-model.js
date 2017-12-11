import timestamps from 'mongoose-timestamp';
import { plugins } from 'mostly-feathers-mongoose';
import { models as contents } from 'playing-content-services';

const options = {
  discriminatorKey: 'type'
};

/*
 * Metrics to measure the performance of the players
 */
const fields = {
  name: { type: 'String', required: true },   // name for the metric
  description: { type: 'String' },            // brief description of the metric
  image: contents.blob.schema,                 // image which represents the metric
  tags: [{ type: 'String' }],                 // the tags of the metric
};

export default function model (app, name) {
  const mongoose = app.get('mongoose');
  const schema = new mongoose.Schema(fields, options);
  schema.plugin(timestamps);
  schema.plugin(plugins.softDelete);
  return mongoose.model(name, schema);
}

model.schema = fields;