const path = require('path');
const fs = require('fs');
const include = require('./include');
const validate = require('../validation');

const isDir = file => fs.lstatSync(file).isDirectory();
const isGql = file => path.extname(file) === '.gql';
const toRes = file =>
  path.join(path.dirname(file), `${path.basename(file, '.gql')}.resolver.js`);
const readFile = file => fs.readFileSync(file, { encoding: 'utf8' });

const findFiles = function* findFiles(root) {
  const files = fs.readdirSync(root).map(file => path.join(root, file));

  const directories = files.filter(isDir);
  const typedefs = files.filter(isGql);
  const resolvers = typedefs.map(toRes);

  yield [typedefs || [], resolvers || []];

  // eslint-disable-next-line no-restricted-syntax
  for (const dir of directories) {
    yield* findFiles(dir);
  }
};

const assemble = (root = '.') => {
  const baseFiles = [];
  const baseResolvers = {};
  const errors = [];
  let errorFound = false;

  // eslint-disable-next-line no-restricted-syntax
  for (const files of findFiles(root)) {
    const [typedefs, resolvers] = files;

    baseFiles.push(...typedefs);

    // eslint-disable-next-line no-restricted-syntax
    for (const resolver of resolvers) {
      const rModule = include(resolver);
      if (rModule) {
        const [isValid, error] = validate(rModule);
        if (!isValid) {
          errorFound = true;
          errors.push({ name: resolver, error });
        } else {
          const { __name, ...rest } = rModule;
          baseResolvers[__name] = rest;
        }
      }
    }
  }

  if (errorFound) {
    return { typeDefs: null, resolvers: null, errors };
  }

  const typeDefs = baseFiles
    .map(readFile)
    .reduce((acc, curr) => `${acc}${curr}`, '');

  const resolvers = {};

  Object.keys(baseResolvers).forEach(rKey => {
    const resolver = baseResolvers[rKey];

    const { Query: SubQuery, Mutation: SubMutation, ...rest } = resolver;

    if (SubQuery) {
      resolvers.Query = {
        ...resolvers.Query,
        ...SubQuery,
      };
    }

    if (SubMutation) {
      resolvers.Mutation = {
        ...resolvers.Mutation,
        ...SubMutation,
      };
    }

    resolvers[rKey] = { ...rest };
  });

  return { typeDefs, resolvers, errors: null };
};

module.exports = assemble;
