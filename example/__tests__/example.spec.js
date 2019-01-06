const path = require('path');
const { makeExecutableSchema } = require('graphql-tools');
const assemble = require('../../index');

describe('Create executable schema', () => {
  let schema;
  let query;

  beforeAll(() => {
    const { typeDefs, resolvers } = assemble(path.join(__dirname, '..'));
    schema = makeExecutableSchema({ typeDefs, resolvers });
    query = __gqlQuery(schema);
  });

  test('can list heroes', async () => {
    const { heroes } = await query('{ heroes { name } }');
    expect(heroes).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ name: 'Dennis Ritchie' }),
        expect.objectContaining({ name: 'Bjarne Stroustrup' }),
      ]),
    );
  });

  test('can find hero', async () => {
    const { hero } = await query('{ hero(id: "foo") { id, name } }');
    expect(hero.name).toEqual('Dennis Ritchie');
  });

  test('can add action', async () => {
    const actionInput = {
      heroId: 'foo',
      desc: 'Test',
      time: '2018',
    };

    const { addAction } = await query(
      `
      mutation AddAction($action: ActionInput!) {
        addAction(action: $action) {
          desc,
          time,
          hero {
            name
          }
        }
      }
    `,
      {},
      {},
      { action: actionInput },
    );

    expect(addAction.desc).toEqual(actionInput.desc);
    expect(addAction.time).toEqual(actionInput.time);
    expect(addAction.hero.name).toEqual('Dennis Ritchie');
  });
});
