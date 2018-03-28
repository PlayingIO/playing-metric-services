/**
 * A point metric is numerical value to measure the performance of the players
 */
const fields = {
  constraints: {
    minimum: { type: Number },             // minimum value
    maximum: { type: Number },             // maximum value
    default: { type: Number, default: 0 }, // default value
  }
};

export default function model (app, name) {
  const mongoose = app.get('mongoose');
  const MetricModel = mongoose.model('metric');
  const schema = new mongoose.Schema(fields);
  return MetricModel.discriminator(name, schema);
}

model.schema = fields;