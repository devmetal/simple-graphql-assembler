const isFunction = require('lodash/isFunction');
const isPlainObject = require('lodash/isPlainObject');
const errors = require('./errors');

const isValidObject = (obj, keys, allowed = []) =>
  keys.every(k => {
    if (isFunction(obj[k])) {
      return true;
    }

    if (allowed.includes(k)) {
      return isValidObject(obj[k], Object.keys(obj[k]));
    }

    return false;
  });

const validate = resolver => {
  if (!isPlainObject(resolver)) {
    return [false, errors.mustBeObject()];
  }

  const keys = Object.keys(resolver);
  if (!keys.length) {
    return [true, null];
  }

  if (!isValidObject(resolver, keys, ['Query', 'Mutation'])) {
    return [false, errors.invalidChildren()];
  }

  return [true, null];
};

module.exports = validate;
