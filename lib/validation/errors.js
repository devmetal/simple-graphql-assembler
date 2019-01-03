exports.mustBeObject = () => 'Resolver must be object';

exports.invalidChildren = () =>
  'Resolver can only contains functions or Query/Mutation objects as children';
