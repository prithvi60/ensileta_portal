export const typeDefs = `#graphql
  type User {
    id: Int!
    username: String!
    email: String!
  }

  type Query {
    users: [User!]!
    user: User
  }

  type Mutation {
    signUp(username: String!, email: String!, password: String!, confirmPassword: String!): User!
    login(email: String!, password: String!): User!,
    logout: Boolean!
  }
`;
