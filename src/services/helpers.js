import fp from 'mostly-func';

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
    return Math.ceil(value * (0.75 + (1 - random) / 2));
  }
  return 0;
};

export const calculateMetricValue = (metric, verb, value, item, chance, variables) => {
  value = evalFomulaValue(metric, value, variables);
  value = probability(chance || 100, value);
  switch(metric.type) {
    case 'point': {
      metric.value = metric.value || 0;
      switch(verb) {
        case 'add': return metric.value + value;
        case 'remove': return Math.max(0, metric.value - value);
        case 'set': return value;
      }
      break;
    }
    case 'set': {
      metric.value = metric.value || {};
      switch(verb) {
        case 'add': {
          metric.value[item] = (metric.value[item] || 0) + value;
          return metric.value;
        }
        case 'remove': {
          metric.value[item] = (metric.value[item] || 0) - value;
          return metric.value;
        }
        case 'set': {
          metric.value[item] = value;
          return metric.value;
        }
      }
      break;
    }
    case 'state': {
      return value;
    }
  }
};

export const updateCompoundMetrics = (userMetrics) => {
  // TODO update compound metric value formula
  const userCompounds = fp.filter(fp.propEq('type', 'compound'), userMetrics);
  return userCompounds.map(metric => {
    metric.value = evalFomulaValue(metric.value);
    return metric;
  });
};