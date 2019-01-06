exports.mustBeObject = () => 'Resolver must be object';

exports.invalidChildren = () =>
  'Resolver can only contains functions or Query/Mutation objects as children';

exports.mustHaveAName = () =>
  'Resolver must contains a __name for a key in resolvers';

exports.nameShouldBeString = () => 'Resolver name has to be a string';
