export const typeDefs = `#graphql
  type User {
    id: Int!
    name: String!
    email: String
  }

  type Query {
    users: [User!]!
    user(id: Int!): User
  }
`;
