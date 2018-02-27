import fp from 'mostly-func';

export const evalFomulaValue = (metric, value, variables) => {
  // TODO evaluate value formula
  switch(metric.type) {
    case 'point': return parseInt(value);
    case 'set': return parseInt(value);
    default: return value;
  }
};

export const calculateMetricValue = (metric, verb, value, item, variables) => {
  value = evalFomulaValue(metric, value, variables);
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