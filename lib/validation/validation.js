const isFunction = require('lodash/isFunction');
const isPlainObject = require('lodash/isPlainObject');
const isString = require('lodash/isString');
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

  if (!resolver.__name) {
    return [false, errors.mustHaveAName()];
  }

  if (!isString(resolver.__name)) {
    return [false, errors.nameShouldBeString()];
  }

  const keys = (Object.keys(resolver) || []).filter(k => k !== '__name');

  if (!keys.length) {
    return [true, null];
  }

  if (!isValidObject(resolver, keys, ['Query', 'Mutation'])) {
    return [false, errors.invalidChildren()];
  }

  return [true, null];
};

module.exports = validate;
