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

const buildBaseResolvers = (baseResolverFiles = []) => {
  const errors = [];

  const baseResolvers = baseResolverFiles.reduce((acc, curr) => {
    const rModule = include(curr);
    if (!rModule) return acc;

    const [isValid, error] = validate(rModule);
    if (!isValid) {
      errors.push({ name: curr, error });
      return acc;
    }

    const { __name, ...rest } = rModule;
    return { ...acc, [__name]: rest };
  }, {});

  return { baseResolvers, errors };
};

const buildFinalResolvers = (baseResolvers = {}) => {
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

    resolvers[rKey] = { ...resolvers[rKey], ...rest };
  });

  return resolvers;
};

const buildTypeDefinitions = (typeDefinitionFiles = []) =>
  typeDefinitionFiles.map(readFile).reduce((acc, curr) => `${acc}${curr}`, '');

const assemble = (root = '.') => {
  const typeDefinitionFiles = [];
  const baseResolverFiles = [];

  Array.from(findFiles(root)).forEach(gql => {
    const [typeDefFiles, resolverFiles] = gql;
    typeDefinitionFiles.push(...typeDefFiles);
    baseResolverFiles.push(...resolverFiles);
  });

  const { baseResolvers, errors } = buildBaseResolvers(baseResolverFiles);

  if (errors.length) {
    return { typeDefs: null, resolvers: null, errors };
  }

  const typeDefs = buildTypeDefinitions(typeDefinitionFiles);
  const resolvers = buildFinalResolvers(baseResolvers);

  return { typeDefs, resolvers, errors: null };
};

const onlyTypeDefs = (root = '') => {
  const typeDefinitionFiles = [];

  Array.from(findFiles(root)).forEach(([typeDefFiles]) => {
    typeDefinitionFiles.push(...typeDefFiles);
  });

  return buildTypeDefinitions(typeDefinitionFiles);
};

module.exports = assemble;
module.exports.onlyTypeDefs = onlyTypeDefs;
