import { plugins } from 'mostly-feathers-mongoose';
import { schemas as contents } from 'playing-content-common';

const options = {
  discriminatorKey: 'type',
  timestamps: true
};

/**
 * Metrics to measure the performance of the players
 */
const fields = {
  name: { type: String, required: true, unique: true },  // name for the metric
  type: { type: String, default: 'metric' }, // discriminator key
  description: { type: String },             // brief description of the metric
  image: contents.blob.schema,               // image which represents the metric
  tags: [{ type: String }],                  // the tags of the metric
};

export default function model (app, name) {
  const mongoose = app.get('mongoose');
  const schema = new mongoose.Schema(fields, options);
  schema.plugin(plugins.trashable);
  return mongoose.model(name, schema);
}

model.schema = fields;