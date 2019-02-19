const path = require('path');
const fixtureTypeDefs = require('../../lib/assembler/__fixtures__/typeDefs');

jest.mock('fs');
jest.mock('yargs');

const createTestDatas = () => {
  // eslint-disable-next-line
  const { __setMockFiles } = require('fs');

  __setMockFiles({
    '/test/hero/hero.gql': fixtureTypeDefs.hero,
    '/test/hero/hero.resolver.js': '',
    '/test/action/action.gql': fixtureTypeDefs.action,
    '/test/action/action.resolver.js': '',
    '/test/query.gql': fixtureTypeDefs.query,
    '/test/mutation.gql': fixtureTypeDefs.mutation,
    '/test/schema.gql': fixtureTypeDefs.schema,
    '/test/action': '',
    '/test/hero': '',
  });
};

const runScript = () => {
  // eslint-disable-next-line
  require('../index');
};

const getWritten = () => {
  // eslint-disable-next-line
  const { __getWrites } = require('fs');
  const file = path.join('/test', 'schema.gql');
  return __getWrites(file);
};

describe('cli tool, make-typedefs', () => {
  let written = '';

  beforeAll(() => {
    createTestDatas();
    runScript();
    written = getWritten();
  });

  describe('typedefs contains all fixture definition', () => {
    const fixtures = Object.keys(fixtureTypeDefs).map(k => [
      k,
      fixtureTypeDefs[k],
    ]);

    test.each(fixtures)('typeDefs includes %s', (key, typeDef) => {
      expect(written.includes(typeDef)).toBeTruthy();
    });
  });
});
