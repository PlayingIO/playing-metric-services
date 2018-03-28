import { models as contents } from 'playing-content-services';

/**
 * A state metric indicates a particular state which the player is currently in.
 */
const fields = {
  constraints: {
    states: [{                             // an array of individual states in the metric
      name: { type: String },              // name of the item
      description: { type: String },       // brief description of the item
      image: contents.blob.schema,         // image that represents the item
      max: { type: Number },               // maximum count of the item a player can get
      hidden: { type: Boolean },           // whether to show up in player profiles if they are not earned
    }]
  }
};

export default function model (app, name) {
  const mongoose = app.get('mongoose');
  const MetricModel = mongoose.model('metric');
  const schema = new mongoose.Schema(fields);
  return MetricModel.discriminator(name, schema);
}

model.schema = fields;