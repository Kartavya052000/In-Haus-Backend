const { makeExecutableSchema } = require('@graphql-tools/schema');
const userResolver = require('./resolvers/userResolver');

const typeDefs = `
  type User {
    id: ID!
    username: String!
    email: String!
    token: String
  }
  
  type ResponseMessage {
    message: String!
  }

  type Query {
    hello: String
    myProfile: User! 
  }

  type Mutation {
    signup(username: String!, email: String!, password: String!): User
    login(email: String!, password: String!): User
    forgotPassword(email: String!): ResponseMessage  
    resetPassword(resetToken: String!, newPassword: String!): ResponseMessage  
  }
`;

const schema = makeExecutableSchema({
  typeDefs,
  resolvers: userResolver,
});

module.exports = schema;
