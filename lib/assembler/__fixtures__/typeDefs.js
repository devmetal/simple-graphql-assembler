const hero = `
type Hero {
  id: ID!
  name: String!
  actions: [Action]
}

extend type Query {
  heroes: [Hero]
  hero(id: ID!): Hero
}
`;

const action = `
type Action {
  id: ID!
  desc: String!
  time: String!
  hero: Hero!
}

input ActionInput {
  heroId: ID!
  desc: String!
  time: String!
}

extend type Mutation {
  addAction(action: ActionInput!): Action
}
`;

const query = `
type Query {
  _: Boolean
}
`;

const mutation = `
type Mutation {
  _: Boolean
}
`;

const schema = `
schema {
  query: Query
  mutation: Mutation
}
`;

module.exports = {
  hero,
  action,
  query,
  mutation,
  schema,
};
