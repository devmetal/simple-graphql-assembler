[![Build Status](https://travis-ci.org/devmetal/simple-graphql-assembler.svg?branch=master)](https://travis-ci.org/devmetal/simple-graphql-assembler)
[![codecov](https://codecov.io/gh/devmetal/simple-graphql-assembler/branch/master/graph/badge.svg)](https://codecov.io/gh/devmetal/simple-graphql-assembler)

## simple-graphql-assembler

The main goal of this package is to create type definitions and resolvers based on the selected folder .qql and resolver.js files. The main funtion will create the input tpyeDefs and resolvers for the AppolloServer by searching for .qql and .resolver.js files.

The qql file formats are not validated, just simply reduced to a one string variable.

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

It is required in the resolver modules to export a plain object with a **\_\_name** property, because the package cannot figure out the key of the end resolver object.

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

The qql file and resolver concatenations are separeted. The package will not search for specific resolver and type definition files. The patterns are based on the .qql extension and the .resolver.js postfix.

In the exameple I put the Query under the Hero resolver but it is not nencessary, because the package will search for the Mutation or the Query named property in the resolver and moves them to the final tree in a separeted reduced property.

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
The errors contains the validation errors.
Two specific rules:
   - Resolvers has to be a plain object
   - Resolvers must contain a __name property (String)
*/

// validation errors
if (errors) {
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
