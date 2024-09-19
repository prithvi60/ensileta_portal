export const typeDefs = `#graphql

  scalar Upload

  type User {
    id: Int!
    username: String!
    email: String!
    company_name: String
    phone_number: String
    address: String
    role: String
    drawing2Dfiles: [File!]
    drawing3Dfiles: [File!]
    drawingBOQfiles: [File!]
  }

  type AccessControl {
    id: Int!
    email: String!
    role: String
  }

  enum SortOrder {
    asc
    desc
  }

  input ViewOrderByInput {
    fileName: SortOrder
    createdAt: SortOrder
  }

  type File {
    id: ID!
    filename: String!
    fileUrl: String!
    userId: String!
    version:   Int
    createdAt: String!
  }

  type Query {
    user: User
    users: User
    getAllAccessControlUsers: [AccessControl]!
    getAll2DFiles: [File!]!
    getAll3DFiles: [File!]!
    getAllBOQFiles: [File!]!
  }

  type Mutation {
    signUp(
      username: String!,
      email: String!,
      password: String!,
      confirmPassword: String!
    ): User

    login(email: String!, password: String!): User!
    logout: Boolean!

    updateUser(
      id: Int!,
      username: String!,
      email: String!,
      company_name: String!,
      phone_number: String!,
      address: String!
    ): User
    upload2DFile(fileUrl: String!, filename: String!) : File!
    upload3DFile(fileUrl: String!, filename: String!) : File!
    uploadBOQFile(fileUrl: String!, filename: String!) : File! 
    uploadAccessControlUsers(
      email: String!,
      password: String!
    ): AccessControl
    
  }
`;
