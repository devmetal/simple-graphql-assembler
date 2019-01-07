// eslint-disable-next-line
const { ApolloServer, gql } = require('apollo-server');
const assemble = require('../index');

const { typeDefs, resolvers, errors } = assemble(__dirname);

if (errors) {
  // eslint-disable-next-line
  console.error(errors);
  process.exit(1);
}

// eslint-disable-next-line
console.log('Resolvers');
// eslint-disable-next-line
console.log(resolvers);

const server = new ApolloServer({
  typeDefs: gql(typeDefs),
  resolvers,
});

server.listen().then(({ url }) => {
  // eslint-disable-next-line
  console.log(`Example server listen at ${url}`);
});
