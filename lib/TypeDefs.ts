export const typeDefs = `#graphql
  type User {
    id: Int!
    username: String!
    email: String!
    company_name: String
    phone_number: String
    address: String
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

  type View2D {
    id: Int!
    fileName: String!
    fileURL: String!
    version:   Int!
    createdAt: String!
  }

  type View3D {
    id: Int!
    fileName: String!
    fileURL: String!
    version:   Int!
    createdAt: String!
  }

  type ViewBOQ {
    id: Int!
    fileName: String!
    fileURL: String!
    version:   Int!
    createdAt: String!
  }

  type Query {
    user: User
    userProfile: User!
    getAll2DFiles(orderBy: ViewOrderByInput) : [View2D]!
    getAll3DFiles(orderBy: ViewOrderByInput) : [View3D]!
    getAllBOQFiles(orderBy: ViewOrderByInput) : [ViewBOQ]!
  }

  type Mutation {
    signUp(username: String!, email: String!, password: String!, confirmPassword: String!): User
    login(email: String!, password: String!): User!,
    logout: Boolean!,
    updateUser(id: Int!, username: String!, email: String!, company_name: String!, phone_number: String!, address: String!): User
    upload2DFile(fileName: String!) : View2D,
    upload3DFile(fileName: String!) : View2D,
    uploadBOQFile(fileName: String!) : View2D,
  }

`;
