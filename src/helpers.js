import assert from 'assert';
import makeDebug from 'debug';
import { helpers } from 'mostly-feathers-mongoose';
import fp from 'mostly-func';
import nerdamer from 'nerdamer';
import { evalFormulaValue } from 'playing-metric-common';

const debug = makeDebug('playing:user-metric-services:helpers');

/**
 * A simple policy to get variable output of a value at a chance
 */
export const probability = (chance, value) => {
  if (chance >= 100) return value;

  const random = Math.random();
  // chance to hit or miss
  if (random < chance / 100) {
    // variable output if it is a number
    if (fp.is(Number, value)) {
      // value range [0.75 ~ 1.25], lower chance, possible bigger outoput
      return Math.ceil(value * (0.75 + (1 - random) / 2));
    } else {
      return value;
    }
  } else {
    return fp.is(Number, value)? 0 : null;
  }
};

/**
 * Get the change of user metric with field operator for updating atomically
 */
export const calcUserMetricChange = (metricType, verb, value, item, chance, variables) => {
  value = evalFormulaValue(metricType, value, variables);
  value = probability(chance || 100, value);
  switch(metricType) {
    case 'point':
      value = parseInt(value);
      switch(verb) {
        case 'add': return { $inc: { 'value': value } };
        case 'remove': return { $inc: { 'value': - value } };
        case 'set': return { $set: { 'value': value } };
        default:
          console.warn('calcUserMetricChange with verb not supported', verb);
      }
      break;
    case 'set':
      value = parseInt(value);
      switch(verb) {
        case 'add': return { $inc: { [`value.${item}`]: value } };
        case 'remove': return { $inc: { [`value.${item}`]: - value } };
        case 'set': return { $set: { [`value.${item}`]: value } };
        default:
          console.warn('calcUserMetricChange with verb not supported', verb);
      }
      break;
    case 'state':
      return value? { $set: { value } } : {}; // chance
    default:
      console.warn('calcUserMetricChange with metric type not supported', metricType.type);
  }
};

/**
 * caculate the old/new delta value of user metric, considering optional update op
 */
export const deltaUserMetric = (oldMetric, newMetric, update) => {
  assert(newMetric, 'newMetric is not provied');
  assert(fp.isNil(oldMetric) || fp.idEquals(oldMetric.metric, newMetric.metric), 'Cannot delta different metric');
  switch(newMetric.type) {
    case 'point':
    case 'state':
    case 'compound': {
      const newVal = newMetric.value;
      const oldVal = update && update.$inc && update.$inc.value?
        newVal - update.$inc.value : oldMetric && oldMetric.value;
      return { old: oldVal, new: newVal };
    }
    case 'set':
      return fp.reduce((delta, key) => {
        const newVal = fp.path(['value', key], newMetric);
        const oldVal = update && update.$inc && update.$inc[`value.${key}`]?
          newVal - update.$inc[`value.${key}`] : fp.path(['value', key], oldMetric || {});
        delta[key] = { old: oldVal, new: newVal };
        return delta;
      }, {}, Object.keys(newMetric.value));
    default:
      console.warn('deltaUserMetric with metric type not supported', newMetric.type);
  }
};

export const updateCompoundValues = (userCompounds, userScores) => {
  const variables = fp.reduce((acc, score) => {
    if (score.type === 'set') {
      return fp.reduce((acc2, key) =>
        fp.assoc(`${score.name}.${key}`, score.value[key], acc2), acc, fp.keys(score.value));
    } else {
      return fp.assoc(score.name, score.value, acc);
    }
  }, {}, userScores);
  return userCompounds.map(metric => {
    metric.value = evalFormulaValue(metric, metric.formula, variables);
    return metric;
  });
};
