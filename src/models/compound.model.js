/**
 * A special type of a metric who's value depends on other metrics.
 */
const fields = {
  constraints: {
    formula: { type: String }              // formula which is evaluated to get the metric's value
  }
};

module.exports = function model (app, name) {
  const mongoose = app.get('mongoose');
  const MetricModel = mongoose.model('metric');
  const schema = new mongoose.Schema(fields);
  return MetricModel.discriminator(name, schema);
};
module.exports.schema = fields;