// eslint-disable-next-line
const { ApolloServer, gql } = require('apollo-server');
const assemble = require('../index');

const { typeDefs, resolvers } = assemble(__dirname);

const server = new ApolloServer({
  typeDefs: gql(typeDefs),
  resolvers,
});

server.listen().then(({ url }) => {
  // eslint-disable-next-line
  console.log(`Example server listen at ${url}`);
});
