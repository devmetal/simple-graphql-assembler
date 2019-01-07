const isPlainObject = require('lodash/isPlainObject');
const isString = require('lodash/isString');
const errors = require('./errors');

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

  return [true, null];
};

module.exports = validate;
