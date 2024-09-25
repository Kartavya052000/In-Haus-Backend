const { makeExecutableSchema } = require('@graphql-tools/schema');
const userResolver = require('./resolvers/userResolver');

const typeDefs = `
  type User {
    id: ID!
    username: String!
    email: String!
    token: String
  }

  type Query {
    hello: String
  }

  type Mutation {
    signup(username: String!, email: String!, password: String!): User
  }
`;

const schema = makeExecutableSchema({
  typeDefs,
  resolvers: userResolver,
});

module.exports = schema;
