const { makeExecutableSchema } = require('graphql-tools');
const assemble = require('../index');
const validationErrors = require('../../validation/errors');
const fixtureResolvers = require('../__fixtures__/resolvers');
const fixtureTypeDefs = require('../__fixtures__/typeDefs');

jest.mock('fs');
jest.mock('../include');

const createTestDatas = () => {
  // eslint-disable-next-line
  const { __setMockFiles } = require('fs');

  // eslint-disable-next-line
  const { __setModules } = require('../include');

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

  __setModules({
    '/test/hero/hero.resolver': { ...fixtureResolvers.hero },
    '/test/action/action.resolver': { ...fixtureResolvers.action },
  });
};

describe('assemble', () => {
  describe('can make a typeDefs and resolvers', () => {
    let typeDefs;
    let resolvers;
    let errors;

    beforeEach(() => {
      createTestDatas();
      ({ typeDefs, resolvers, errors } = assemble('/test'));
    });

    test('error should be null', () => {
      expect(errors).toBeNull();
    });

    test('they are make valid schema', () => {
      expect(() => {
        makeExecutableSchema({ typeDefs, resolvers });
      }).not.toThrow();
    });

    test('and operations works', async () => {
      const schema = makeExecutableSchema({ typeDefs, resolvers });
      const query = __gqlQuery(schema);

      const { heroes } = await query(`
      {
        heroes {
          id
          name
          actions {
            id
            desc
            time
            hero {
              name
            }
          }
        }
      }
      `);

      expect(heroes).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            name: 'Dennis Ritchie',
            actions: expect.arrayContaining([
              expect.objectContaining({
                desc: 'Create C Language',
                time: '1972',
              }),
            ]),
          }),
          expect.objectContaining({ name: 'Bjarne Stroustrup' }),
        ]),
      );

      await query(
        `
        mutation AddAction($action: ActionInput!) {
          addAction(action: $action) {
            id
          }
        }
      `,
        {},
        {},
        { action: { heroId: heroes[0].id, desc: 'Test', time: '2019' } },
      );

      const { hero } = await query(`
      {
        hero(id: "${heroes[0].id}") {
          id
          name
          actions {
            id
            desc
            time
          }
        }
      }
      `);

      expect(hero.id).toEqual(heroes[0].id);
      expect(hero.name).toEqual(heroes[0].name);

      expect(hero.actions).toEqual(
        expect.arrayContaining([
          expect.objectContaining({ desc: 'Test', time: '2019' }),
        ]),
      );
    });
  });

  describe('can validate resolver objects', () => {
    let typeDefs;
    let resolvers;
    let errors;

    beforeEach(() => {
      createTestDatas();
    });

    describe('missing name', () => {
      beforeEach(() => {
        // eslint-disable-next-line
        const { __setModules } = require('../include');

        __setModules({
          '/test/hero/hero.resolver': {
            ...fixtureResolvers.hero,
            __name: undefined,
          },
          '/test/action/action.resolver': {
            ...fixtureResolvers.action,
            __name: undefined,
          },
        });

        ({ typeDefs, resolvers, errors } = assemble('/test'));
      });

      test('should cause missing name error', () => {
        expect(typeDefs).toBeNull();
        expect(resolvers).toBeNull();
        expect(errors).toEqual(
          expect.arrayContaining([
            expect.objectContaining({
              name: '/test/hero/hero.resolver.js',
              error: validationErrors.mustHaveAName(),
            }),
            expect.objectContaining({
              name: '/test/action/action.resolver.js',
              error: validationErrors.mustHaveAName(),
            }),
          ]),
        );
      });
    });
  });
});
