const validate = require('../index');
const errors = require('../errors');

describe('Resolver object', () => {
  describe('should be valid when', () => {
    test('its empty object', () => {
      const [isValid] = validate({});
      expect(isValid).toBeTruthy();
    });

    test('contains only functions', () => {
      const r = { foo() {}, bar() {} };
      const [isValid] = validate(r);
      expect(isValid).toBeTruthy();
    });

    test('contains Query object', () => {
      const r = { Query: {} };
      const [isValid] = validate(r);
      expect(isValid).toBeTruthy();
    });

    test('contains Mutation object', () => {
      const r = { Mutation: {} };
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

    test('contains non function children', () => {
      const [isValid, error] = validate({ foo: 'bar', bar: [] });
      expect(isValid).toBeFalsy();
      expect(error).toEqual(errors.invalidChildren());
    });
  });

  describe('child Query object', () => {
    describe('should be valid when', () => {
      test('contains only functions', () => {
        const r = { Query: { foo() {}, bar() {} } };
        const [isValid] = validate(r);
        expect(isValid).toBeTruthy();
      });
    });

    describe('should be invalid when', () => {
      test('contains non function children', () => {
        const [isValid, error] = validate({ Query: { foo: 'bar', bar: [] } });
        expect(isValid).toBeFalsy();
        expect(error).toEqual(errors.invalidChildren());
      });
    });
  });

  describe('child Mutation object', () => {
    describe('should be valid when', () => {
      test('contains only functions', () => {
        const r = { Mutation: { foo() {}, bar() {} } };
        const [isValid] = validate(r);
        expect(isValid).toBeTruthy();
      });
    });

    describe('should be invalid when', () => {
      test('contains non function children', () => {
        const [isValid, error] = validate({
          Mutation: { foo: 'bar', bar: [] },
        });
        expect(isValid).toBeFalsy();
        expect(error).toEqual(errors.invalidChildren());
      });
    });
  });
});
