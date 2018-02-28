import fp from 'mostly-func';
import makeDebug from 'debug';

const debug = makeDebug('playing:user-metric-services:helpers');

export const evalFomulaValue = (metric, value, variables) => {
  // TODO evaluate value formula
  switch(metric.type) {
    case 'point': return parseInt(value);
    case 'set': return parseInt(value);
    default: return value;
  }
};

export const probability = (chance, value) => {
  const random = Math.random();
  if (random < chance / 100) {
    if (fp.is(Number, value)) {
      return Math.ceil(value * (0.75 + (1 - random) / 2));
    } else {
      return value;
    }
  } else {
    return fp.is(Number, value)? 0 : null;
  }
};

export const calculateMetricValue = (metric, verb, value, item, chance, variables) => {
  value = evalFomulaValue(metric, value, variables);
  value = probability(chance || 100, value);
  switch(metric.type) {
    case 'point':
      metric.value = metric.value || 0;
      switch(verb) {
        case 'add': return metric.value + value;
        case 'remove': return Math.max(0, metric.value - value);
        case 'set': return value;
        default:
          console.warn('calculateMetricValue with verb not supported', verb);
      }
      break;
    case 'set':
      metric.value = metric.value || {};
      switch(verb) {
        case 'add':
          metric.value[item] = (metric.value[item] || 0) + value;
          return metric.value;
        case 'remove':
          metric.value[item] = (metric.value[item] || 0) - value;
          return metric.value;
        case 'set':
          metric.value[item] = value;
          return metric.value;
        default:
          console.warn('calculateMetricValue with verb not supported', verb);
      }
      break;
    case 'state':
      return value? value : metric.value; // chance
    default:
      console.warn('calculateMetricValue with metric type not supported', metric.type);
  }
};

export const updateCompoundMetrics = (userMetrics) => {
  // TODO update compound metric value formula
  const userCompounds = fp.filter(fp.propEq('type', 'compound'), userMetrics);
  return userCompounds.map(metric => {
    metric.value = evalFomulaValue(metric, metric.value);
    return metric;
  });
};