import { plugins } from 'mostly-feathers-mongoose';
import { models as contents } from 'playing-content-services';

/**
 * A set metric is a group of unordered items.
 */
const fields = {
  constraints: {
    maxItems: { type: Number },            // maximum number of unique items of the set that a player can have
    items: [{                              // an array of individual items in the set.
      name: { type: String },              // name of the item
      description: { type: String },       // brief description of the item
      image: contents.blob.schema,         // image that represents the item
      maximum: { type: Number },           // maximum count of the item a player can get
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