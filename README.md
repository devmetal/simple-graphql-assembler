[![Build Status](https://travis-ci.org/devmetal/simple-graphql-assembler.svg?branch=master)](https://travis-ci.org/devmetal/simple-graphql-assembler)
[![codecov](https://codecov.io/gh/devmetal/simple-graphql-assembler/branch/master/graph/badge.svg)](https://codecov.io/gh/devmetal/simple-graphql-assembler)

## simple-graphql-assembler

The main goal with this package to create a type definitions and resolvers based on the selected folder .gql and resolver.js files. The main function will find the .gql and .resolver.js files and creates the input typeDefs and resolvers for ApolloServer.

The format of gql files are not validated, and simply just reduced all to one string variable.

```gql
// hero.gql
type Hero {
  id: ID!
  name: String!
  actions: [Action]
}

extend type Query {
  heroes: [Hero]
  hero(id: ID!): Hero
}
```

The resolver modules had to default export a plain object, with a **\_\_name** property. Its important, and its validated, because the package will not figure out the key of your resolvers in the end resolvers object.

```JavaScript
// hero.resolver.js
const heroDb = require('../heroDb');

module.exports = {
  __name: 'Hero',

  actions(h) {
    return h.actions;
  },

  Query: {
    heroes() {
      return [...heroDb];
    },
    hero(_, { id }) {
      return heroDb.find(h => h.id === id);
    },
  },
};
```

The **\_\_name** field will be removed from the final resolvers tree.

The concatenation of gql files and resolvers are two separated thing. The package will not search for specific resolvers and type definition files. The two pattern is a .gql extenstion and a .resolver.js postfix.

You can see, i put the Query under the Hero resolver. Its not necessary. If the package saw the Mutation, or Query named property in your resolvers, they will be moved to a reduced separated property in the final tree.

### installation

#### npm

```
npm install simple-graphql-assembler
```

#### yarn

```
yarn add simple-graphql-assembler
```

### usage

```JavaScript
const { ApolloServer, gql } = require('apollo-server');
const assemble = require('simple-graphql-assembler');

const { typeDefs, resolvers, errors } = assemble(__dirname);
/*
The errors contains a validation errors.
Two specific rules are here:
   - Resolvers has to be a plain object
   - Resolvers must contains a __name property (string)
*/

if (errors) {
  // validation errors
  console.log(errors);
  process.exit(1);
}

console.log(resolvers);
/*
{ Mutation: { addAction: [Function: addAction] },
  Action: { hero: [Function: hero] },
  Query: { heroes: [Function: heroes], hero: [Function: hero] },
  Hero: { actions: [Function: actions] } }
*/

const server = new ApolloServer({
  typeDefs: gql(typeDefs),
  resolvers,
});

server.listen().then(({ url }) => {
  console.log(`Example server listen at ${url}`);
});
```
