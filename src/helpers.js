import makeDebug from 'debug';
import { helpers } from 'mostly-feathers-mongoose';
import fp from 'mostly-func';
import nerdamer from 'nerdamer';

const debug = makeDebug('playing:user-metric-services:helpers');

export const evalFormulaValue = (metric, value, variables) => {
  // TODO evaluate value formula
  switch(metric.type) {
    case 'point': return parseInt(value);
    case 'set': return parseInt(value);
    default: return value;
  }
};

// a simple policy to get variable output of a value at a chance
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

// use field operator to update user's metrics value atomically
export const updateUserMetricValue = (metric, verb, value, item, chance, variables) => {
  value = evalFormulaValue(metric, value, variables);
  value = probability(chance || 100, value);
  switch(metric.type) {
    case 'point':
      value = parseInt(value);
      switch(verb) {
        case 'add': return { $inc: { 'value': value } };
        case 'remove': return { $inc: { 'value': - value } };
        case 'set': return { $set: { 'value': value } };
        default:
          console.warn('updateUserMetricValue with verb not supported', verb);
      }
      break;
    case 'set':
      value = parseInt(value);
      switch(verb) {
        case 'add': return { $inc: { [`value.${item}`]: value } };
        case 'remove': return { $inc: { [`value.${item}`]: - value } };
        case 'set': return { $set: { [`value.${item}`]: value } };
        default:
          console.warn('updateUserMetricValue with verb not supported', verb);
      }
      break;
    case 'state':
      return { $set: { value: value || metric.value } }; // chance
    default:
      console.warn('updateUserMetricValue with metric type not supported', metric.type);
  }
};

export const updateCompoundMetrics = (userMetrics) => {
  // TODO update compound metric value formula
  const userCompounds = fp.filter(fp.propEq('type', 'compound'), userMetrics);
  return userCompounds.map(metric => {
    metric.value = evalFormulaValue(metric, metric.value);
    return metric;
  });
};

export const createUserMetrics = (app) => {
  const svcUserMetrics = app.service('user-metrics');
  return async (user, rewards) => {
    const create = fp.reduce((arr, reward) => {
      if (reward.metric) {
        reward.metric = helpers.getId(reward.metric);
        reward.user = user;
        return arr.concat(svcUserMetrics.create(reward));
      }
      return arr;
    }, []);
    const metrics = await Promise.all(create(rewards));
    return fp.flatten(metrics);
  };
};