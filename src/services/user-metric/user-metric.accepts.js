const fp = require('mostly-func');
const { helpers } = require('mostly-feathers-validate');

module.exports = function accepts (context) {
  // validation rules
  const chance = { arg: 'chance', type: 'int', default: 100, description: 'Chance of metric' };
  const metric = { arg: 'metric', type: 'string', required: true, description: 'Metric id' };
  const user = { arg: 'user', type: 'string', required: true, description: 'Current user' };
  const value = { arg: 'value', type: 'string', required: true, description: 'Value of metric' };
  const variables = { arg: 'variables', type: 'object', default: {}, description: 'Variables of metric' };
  const verb = { arg: 'verb', type: 'string', required: true, description: 'Verb of metric' };
  
  return {
    create: [ metric, user, verb, value, chance, variables ]
  };
};