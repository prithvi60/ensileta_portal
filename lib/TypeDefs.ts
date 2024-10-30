export const typeDefs = `#graphql

  scalar Upload

  type User {
    id: Int
    username: String
    email: String
    company_name: String
    phone_number: String
    address: String
    role: String
    drawing2Dfiles: [Drawing2D]
    drawing3Dfiles: [Drawing3D]
    drawingBOQfiles: [DrawingBOQ]
    kanbanCards:     [KanbanCard]
  }

  type AccessControl {
    id: Int!
    username: String
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

  type Drawing2D {
    id: Int
    filename: String
    fileUrl: String
    version: Int
    userId: String
    createdAt: String
    markerGroups: [MarkerGroup!]!
  }

  type Drawing3D {
    id: Int
    filename: String
    fileUrl: String
    version: Int
    userId: String
    createdAt: String
    markerGroups: [MarkerGroup]
  }

  type DrawingBOQ {
    id: Int
    filename: String
    fileUrl: String
    version: Int
    userId: String
    createdAt: String
    markerGroups: [MarkerGroup]
  }


  type UploadS3{
    file: String!
    filename: String!
    userName: String!
  }

  type File {
    id: ID!
    filename: String!
    fileUrl: String!
    userId: String!
    version:   Int
    createdAt: String!
  }

  input KanbanCardInput {
  id: Int
  column: String!
  title: String!
  userId: Int!
}

type KanbanCard {
  id: Int!
  column: String!
  title: String!
  userId: Int!
}

type DeleteKanbanCardResponse {
  success: Boolean!
  message: String
}

type UpdateKanbanCardResponse {
  success: Boolean!
  message: String!
  card: KanbanCard
}

input UpdateKanbanCardInput {
  id: Int!
  title: String!
  column: String!
}

type Marker {
  id: Int!
  comment: String!
  left: Float!
  top: Float!
  user: String!
  userId: Int!
  markerGroupId: Int!
}

input MarkerInput {
  comment: String!
  left: Float!
  top: Float!
  user: String!
  userId: Int!
}

input MarkerGroupInput {
  drawing2DId: Int
  markers: [MarkerInput!]!
}

type MarkerGroup {
  id: Int!
  markers: [Marker!]!
}

  type Query {
    user: User
    users: [User]
    getUser(email: String!): User
    getAllAccessControlUsers: [AccessControl]!
    getEmployeeUser: AccessControl!
    getAll2DFiles: [Drawing2D!]!
    getAll3DFiles: [Drawing3D!]!
    getAllBOQFiles: [DrawingBOQ!]!
    kanbanCards(userId: Int!): [KanbanCard]
    getAllMarkerGroups: [MarkerGroup!]!
    getMarkerGroupsByDrawing2D(drawing2DId: Int!): [MarkerGroup!]!
  }
  

  type Mutation {
    signUp(
      username: String!,
      email: String!,
      company_name: String!,
      password: String!,
      confirmPassword: String!
    ): User

    login(email: String!, password: String!): User!
    logout: Boolean!
    updateUser(
      id: Int!,
      username: String
      email: String!,
      company_name: String!,
      phone_number: String!,
      address: String!
    ): User
    uploadFileToS3Storage(file: String!, filename: String!, userName: String!) : File!
    upload2DFile(fileUrl: String!, filename: String!, userId: Int!) : Drawing2D!
    upload3DFile(fileUrl: String!, filename: String!, userId: Int!) : Drawing3D!
    uploadBOQFile(fileUrl: String!, filename: String!, userId: Int!) : DrawingBOQ! 
    uploadAccessControlUsers(
      username: String!,
      email: String!,
      password: String!
    ): AccessControl
    saveKanbanCards(userId: Int!, cards: [KanbanCardInput!]!): Boolean!
    deleteKanbanCard(id: Int!): DeleteKanbanCardResponse!
    updateKanbanCard(id: Int!, title: String!, column: String!): UpdateKanbanCardResponse!
    addMarkerGroups(drawing2DId: Int!,input: [[MarkerInput!]!]!): [MarkerGroup!]!
  }
`;
