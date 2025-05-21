export const typeDefs = `#graphql

  scalar Upload
  scalar JSON

  type User {
    id: Int
    username: String
    email: String
    company_name: String
    phone_number: String
    address: String
    department: String
    role: String
    drawing2Dfiles: [Drawing2D]
    drawing3Dfiles: [Drawing3D]
    drawingMBfiles: [DrawingMB]
    drawingABfiles: [DrawingAB]
    drawingBOQfiles: [DrawingBOQ]
    kanbanCards:     [KanbanCard]
  }

  type AccessControl {
    id: Int!
    username: String
    email: String!
    department: String
    role: String
    company_name: String
    phone_number: String
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
    markerGroup2d: [MarkerGroup2D]
    approve: Boolean!
  }

  type Drawing3D {
    id: Int
    filename: String
    fileUrl: String
    version: Int
    userId: String
    createdAt: String
    markerGroup3d: [MarkerGroup3D]
    approve: Boolean!
  }

  type DrawingMB {
    id: Int
    filename: String
    fileUrl: String
    version: Int
    userId: String
    createdAt: String
    markerGroupMb: [MarkerGroupMB]
    approve: Boolean!
  }

  type DrawingAB {
    id: Int
    filename: String
    fileUrl: String
    version: Int
    userId: String
    createdAt: String
    markerGroupAb: [MarkerGroupAB]
    approve: Boolean!
  }

  type DrawingBOQ {
    id: Int
    filename: String
    fileUrl: String
    version: Int
    userId: String
    createdAt: String
    markerGroupBoq: [MarkerGroupBoq]
    approve: Boolean!
  }

  type MarkerGroup2D {
  id: ID!
  data: JSON!
  createdAt: String!
  drawing2DId: Int
  drawing2D: Drawing2D
}

type MarkerGroup3D {
  id: ID!
  data: JSON!
  createdAt: String!
  drawing3DId: Int
  drawing3D: Drawing3D
}

type MarkerGroupMB {
  id: ID!
  data: JSON!
  createdAt: String!
  drawingMbId: Int
  drawingMB: DrawingMB
}

type MarkerGroupAB {
  id: ID!
  data: JSON!
  createdAt: String!
  drawingAbId: Int
  drawingAB: DrawingAB
}

type MarkerGroupBoq {
  id: ID!
  data: JSON!
  createdAt: String!
  drawingBoqId: Int
  drawingBoq: DrawingBOQ
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

  type Otp {
  id: ID!
  email: String!
  otp: String! # Numeric OTP
  expiresAt: String!
  verified: Boolean!
  createdAt: String!
}

type GenerateOtpResponse {
  success: Boolean!
  message: String
  otp: String
  expiresAt: String
}

type VerifyOtpResponse {
  success: Boolean!
  message: String
  token: String
  user: User 
}

type LogoutResponse {
  success: Boolean!
  message: String
}

enum DrawingType {
  DRAWING_2D
  DRAWING_3D
  DRAWING_MB
  DRAWING_AB
  DRAWING_BOQ
}

  type Query {
    user: User
    users: [User]
    getUser(email: String!): User
    getAccessControlUsers(company_name: String!): [AccessControl]!
    getEmployeeUser: AccessControl!
    getAll2DFiles: [Drawing2D!]!
    getAll3DFiles: [Drawing3D!]!
    getAllMBFiles: [DrawingMB!]!
    getAllABFiles: [DrawingAB!]!
    getAllBOQFiles: [DrawingBOQ!]!
    kanbanCards(userId: Int!): [KanbanCard]
    getMarkerGroupBy2DId(drawing2DId: Int!): MarkerGroup2D
    getMarkerGroupBy3DId(drawing3DId: Int!): MarkerGroup3D
    getMarkerGroupByMBId(drawingMbId: Int!): MarkerGroupMB
    getMarkerGroupByABId(drawingAbId: Int!): MarkerGroupAB

    
    # excess one
    getMarkerGroupByBoqId(drawingBoqId: Int!): MarkerGroupBoq
  }
  

  type Mutation {
    signUp(
      username: String!,
      email: String!,
      company_name: String!,
      phone_number: String!,
      address: String!,
      department: String!,
      password: String!,
      confirmPassword: String!
    ): User

    login(email: String!, password: String!): User!
    logout(email: String!): LogoutResponse
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
    uploadMBFile(fileUrl: String!, filename: String!, userId: Int!) : DrawingMB!
    uploadABFile(fileUrl: String!, filename: String!, userId: Int!) : DrawingAB!
    uploadBOQFile(fileUrl: String!, filename: String!, userId: Int!) : DrawingBOQ! 
    uploadAccessControlUsers(
      username: String!,
      email: String!,
      department: String!,
      password: String!,
      company_name: String!,
      phone_number: String!
    ): AccessControl
      saveKanbanCard(userId: Int!, card: KanbanCardInput!): Boolean!
    deleteKanbanCard(id: Int!): DeleteKanbanCardResponse!
    updateKanbanCard(id: Int!, title: String!, column: String!): UpdateKanbanCardResponse!
    createMarkerGroup2D(data: JSON!, drawing2DId: Int!): MarkerGroup2D!
    createMarkerGroup3D(data: JSON!, drawing3DId: Int!): MarkerGroup3D!
    createMarkerGroupMB(data: JSON!, drawingMbId: Int!): MarkerGroupMB!
    createMarkerGroupAB(data: JSON!, drawingAbId: Int!): MarkerGroupAB!
    toggleApproveDrawing(id: Int!, drawingType: DrawingType!): Boolean!


    # excess one
    createMarkerGroupBOQ(data: JSON!, drawingBoqId: Int!): MarkerGroupBoq!

    # OTP Generator
    generateOtp(email: String!): GenerateOtpResponse!
    verifyOtp(email: String!, otp: String!): VerifyOtpResponse!
  }
`;
