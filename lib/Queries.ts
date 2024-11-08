import { gql } from "@apollo/client";

// Authentication

export const SIGN_UP = gql`
  mutation sigUp(
    $username: String!
    $email: String!
    $company_name: String!
    $phone_number: String!
    $address: String!
    $department: String!
    $password: String!
    $confirmPassword: String!
  ) {
    signUp(
      username: $username
      email: $email
      company_name: $company_name
      phone_number: $phone_number
      address: $address
      department: $department
      password: $password
      confirmPassword: $confirmPassword
    ) {
      id
      username
      email
    }
  }
`;

export const LOGIN = gql`
  mutation login($email: String!, $password: String!) {
    login(email: $email, password: $password) {
      id
      username
      email
    }
  }
`;

// users details get and update queries

export const GET_USER = gql`
  query GetUser {
    user {
      id
      username
      email
      company_name
      phone_number
      address
      role
      drawing2Dfiles {
        id
        filename
        fileUrl
      }
      drawing3Dfiles {
        id
        filename
        fileUrl
      }
      drawingMBfiles {
        id
        filename
        fileUrl
      }
      drawingABfiles {
        id
        filename
        fileUrl
      }
      drawingBOQfiles {
        id
        filename
        fileUrl
      }
    }
  }
`;

export const GET_USER_ROLE = gql`
  query GetUserRole($email: String!) {
    user(email: $email) {
      role
    }
  }
`;

export const GET_USERS = gql`
  query GetUsers {
    users {
      id
      username
      email
      company_name
      phone_number
      address
      role
      drawing2Dfiles {
        id
        filename
        fileUrl
        version
        createdAt
      }
      drawing3Dfiles {
        id
        filename
        fileUrl
        version
        createdAt
      }
      drawingMBfiles {
        id
        filename
        fileUrl
        version
        createdAt
      }
      drawingABfiles {
        id
        filename
        fileUrl
        version
        createdAt
      }
      drawingBOQfiles {
        id
        filename
        fileUrl
        version
        createdAt
      }
    }
  }
`;

export const UPDATE_USER = gql`
  mutation UpdateUser(
    $id: Int!
    $username: String!
    $email: String!
    $company_name: String!
    $phone_number: String!
    $address: String!
  ) {
    updateUser(
      id: $id
      username: $username
      email: $email
      company_name: $company_name
      phone_number: $phone_number
      address: $address
    ) {
      id
      username
      email
      company_name
      phone_number
      address
    }
  }
`;

// View 2D queries

export const ADD_2D_FILENAME = gql`
  mutation Upload2DFile($fileUrl: String!, $filename: String!, $userId: Int!) {
    upload2DFile(fileUrl: $fileUrl, filename: $filename, userId: $userId) {
      id
      filename
      fileUrl
      userId
      version
      createdAt
    }
  }
`;

export const GET_ALL_2D_VIEW = gql`
  query GetAll2DFiles {
    getAll2DFiles {
      id
      filename
      fileUrl
      userId
      version
      createdAt
      approve
    }
  }
`;

// View 3D queries

export const ADD_3D_FILENAME = gql`
  mutation Upload3DFile($fileUrl: String!, $filename: String!, $userId: Int!) {
    upload3DFile(fileUrl: $fileUrl, filename: $filename, userId: $userId) {
      id
      filename
      fileUrl
      userId
      version
      createdAt
    }
  }
`;

export const GET_ALL_3D_VIEW = gql`
  query GetAll3DFiles {
    getAll3DFiles {
      id
      filename
      fileUrl
      userId
      version
      createdAt
      approve
    }
  }
`;

// View Mood Board queries

export const ADD_MB_FILENAME = gql`
  mutation UploadMBFile($fileUrl: String!, $filename: String!, $userId: Int!) {
    uploadMBFile(fileUrl: $fileUrl, filename: $filename, userId: $userId) {
      id
      filename
      fileUrl
      userId
      version
      createdAt
    }
  }
`;

export const GET_ALL_MB_VIEW = gql`
  query GetAllMBFiles {
    getAllMBFiles {
      id
      filename
      fileUrl
      userId
      version
      createdAt
      approve
    }
  }
`;

// View Approval Board queries

export const ADD_AB_FILENAME = gql`
  mutation UploadABFile($fileUrl: String!, $filename: String!, $userId: Int!) {
    uploadABFile(fileUrl: $fileUrl, filename: $filename, userId: $userId) {
      id
      filename
      fileUrl
      userId
      version
      createdAt
    }
  }
`;

export const GET_ALL_AB_VIEW = gql`
  query GetAllABFiles {
    getAllABFiles {
      id
      filename
      fileUrl
      userId
      version
      createdAt
      approve
    }
  }
`;

// View BOQ queries

export const ADD_BOQ_FILENAME = gql`
  mutation UploadBOQFile($fileUrl: String!, $filename: String!, $userId: Int!) {
    uploadBOQFile(fileUrl: $fileUrl, filename: $filename, userId: $userId) {
      id
      filename
      fileUrl
      userId
      version
      createdAt
    }
  }
`;

export const GET_ALL_BOQ_VIEW = gql`
  query GetAllBOQFiles {
    getAllBOQFiles {
      id
      filename
      fileUrl
      userId
      version
      createdAt
      approve
    }
  }
`;

// Access Control

export const ADD_EMPLOYEE = gql`
  mutation UploadAccessControlUsers(
    $username: String!
    $email: String!
    $department: String!
    $password: String!
    $company_name: String!
    $phone_number: String!
  ) {
    uploadAccessControlUsers(
      username: $username
      email: $email
      department: $department
      password: $password
      company_name: $company_name
      phone_number: $phone_number
    ) {
      id
      username
      email
      role
      company_name
      phone_number
    }
  }
`;

export const GET_EMPLOYEE_LISTS = gql`
  query GetAccessControlUsers($company_name: String!) {
    getAccessControlUsers(company_name: $company_name) {
      id
      email
      role
      company_name
      phone_number
    }
  }
`;

export const GET_EMPLOYEE = gql`
  query getEmployeeUser {
    getEmployeeUser {
      id
      username
      email
      role
      phone_number
      company_name
    }
  }
`;

// S3 Bucket

export const UPLOAD_S3_STORAGE = gql`
  mutation UploadFileToS3Storage(
    $file: String!
    $filename: String!
    $userName: String!
  ) {
    uploadFileToS3Storage(
      file: $file
      filename: $filename
      userName: $userName
    ) {
      id
      filename
      fileUrl
      userId
      version
      createdAt
    }
  }
`;

// Kanban Cards
export const CREATE_CARD = gql`
  mutation CreateKanbanCard($userId: Int!, $card: KanbanCardInput!) {
    createKanbanCard(userId: $userId, card: $card)
  }
`;

export const SAVE_KANBAN_CARD = gql`
  mutation SaveKanbanCard($userId: Int!, $card: KanbanCardInput!) {
    saveKanbanCard(userId: $userId, card: $card)
  }
`;
export const GET_KANBAN_CARDS = gql`
  query GetKanbanCards($userId: Int!) {
    kanbanCards(userId: $userId) {
      id
      title
      column
      userId
    }
  }
`;

export const DELETE_KANBAN_CARDS = gql`
  mutation DeleteKanbanCard($id: Int!) {
    deleteKanbanCard(id: $id) {
      success
      message
    }
  }
`;

export const UPDATE_KANBAN_CARDS = gql`
  mutation UpdateKanbanCard($id: Int!, $title: String!, $column: String!) {
    updateKanbanCard(id: $id, title: $title, column: $column) {
      success
      message
      card {
        id
        title
        column
      }
    }
  }
`;

// Markers

export const GET_MARKER_GROUP_BY_ID_2D = gql`
  query GetMarkerGroupBy2DId($drawing2DId: Int!) {
    getMarkerGroupBy2DId(drawing2DId: $drawing2DId) {
      id
      data
      createdAt
      drawing2DId
    }
  }
`;

export const GET_MARKER_GROUP_BY_ID_3D = gql`
  query GetMarkerGroupBy3DId($drawing3DId: Int!) {
    getMarkerGroupBy3DId(drawing3DId: $drawing3DId) {
      id
      data
      createdAt
      drawing3DId
    }
  }
`;

export const GET_MARKER_GROUP_BY_ID_MB = gql`
  query GetMarkerGroupByMBId($drawingMbId: Int!) {
    getMarkerGroupByMBId(drawingMbId: $drawingMbId) {
      id
      data
      createdAt
      drawingMbId
    }
  }
`;

export const GET_MARKER_GROUP_BY_ID_AB = gql`
  query GetMarkerGroupByABId($drawingAbId: Int!) {
    getMarkerGroupByABId(drawingAbId: $drawingAbId) {
      id
      data
      createdAt
      drawingAbId
    }
  }
`;

export const GET_MARKER_GROUP_BY_ID_BOQ = gql`
  query GetMarkerGroupByBOQId($drawingBoqId: Int!) {
    getMarkerGroupByBoqId(drawingBoqId: $drawingBoqId) {
      id
      data
      createdAt
      drawingBoqId
    }
  }
`;

export const CREATE_MARKER_GROUP_2D = gql`
  mutation CreateMarkerGroup2D($data: JSON!, $drawing2DId: Int!) {
    createMarkerGroup2D(data: $data, drawing2DId: $drawing2DId) {
      id
      data
    }
  }
`;

export const CREATE_MARKER_GROUP_3D = gql`
  mutation CreateMarkerGroup3D($data: JSON!, $drawing3DId: Int!) {
    createMarkerGroup3D(data: $data, drawing3DId: $drawing3DId) {
      id
      data
    }
  }
`;

export const CREATE_MARKER_GROUP_MB = gql`
  mutation CreateMarkerGroupMB($data: JSON!, $drawingMbId: Int!) {
    createMarkerGroupMB(data: $data, drawingMbId: $drawingMbId) {
      id
      data
    }
  }
`;

export const CREATE_MARKER_GROUP_AB = gql`
  mutation CreateMarkerGroupAB($data: JSON!, $drawingAbId: Int!) {
    createMarkerGroupAB(data: $data, drawingAbId: $drawingAbId) {
      id
      data
    }
  }
`;

export const CREATE_MARKER_GROUP_BOQ = gql`
  mutation CreateMarkerGroupBOQ($data: JSON!, $drawingBoqId: Int!) {
    createMarkerGroupBOQ(data: $data, drawingBoqId: $drawingBoqId) {
      id
      data
    }
  }
`;

// Toggle Approve Button
export const TOGGLE_APPROVE_DRAWING = gql`
  mutation ToggleApproveDrawing($id: Int!, $drawingType: DrawingType!) {
    toggleApproveDrawing(id: $id, drawingType: $drawingType)
  }
`;
