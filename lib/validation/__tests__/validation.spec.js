const validate = require('../index');
const errors = require('../errors');

describe('Resolver object', () => {
  describe('should be valid when', () => {
    test('contains only name', () => {
      const [isValid] = validate({ __name: 'Test' });
      expect(isValid).toBeTruthy();
    });

    test('contains only functions', () => {
      const r = { __name: 'Test', foo() {}, bar() {} };
      const [isValid] = validate(r);
      expect(isValid).toBeTruthy();
    });

    test('contains Query object', () => {
      const r = { __name: 'Test', Query: {} };
      const [isValid] = validate(r);
      expect(isValid).toBeTruthy();
    });

    test('contains Mutation object', () => {
      const r = { __name: 'Test', Mutation: {} };
      const [isValid] = validate(r);
      expect(isValid).toBeTruthy();
    });
  });

  describe('should be invalid when', () => {
    test.each([undefined, null, [], ''])('its %p', v => {
      const [isValid, error] = validate(v);
      expect(isValid).toBeFalsy();
      expect(error).toEqual(errors.mustBeObject());
    });

    test('does not contain __name property', () => {
      const [isValid, error] = validate({
        foo() {},
      });
      expect(isValid).toBeFalsy();
      expect(error).toEqual(errors.mustHaveAName());
    });

    test('__name is not string', () => {
      const [isValid, error] = validate({
        __name: {},
        foo() {},
      });
      expect(isValid).toBeFalsy();
      expect(error).toEqual(errors.nameShouldBeString());
    });
  });
});
