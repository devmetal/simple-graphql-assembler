const { graphql } = require('graphql');

global.__gqlQuery = gqlSchema => async (
  query,
  root = {},
  ctx = {},
  ...rest
) => {
  const { data, errors } = await graphql(gqlSchema, query, root, ctx, ...rest);

  if (errors) {
    throw errors;
  }

  return data;
};
