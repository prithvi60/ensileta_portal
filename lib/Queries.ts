import { gql } from "@apollo/client";

// Authentication

export const SIGN_UP = gql`
  mutation sigUp(
    $username: String!
    $email: String!
    $company_name: String!
    $password: String!
    $confirmPassword: String!
  ) {
    signUp(
      username: $username
      email: $email
      company_name: $company_name
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

// export const GET_USERS = gql`
//   query GetUsers {
//     users {
//       id
//       username
//       email
//       company_name
//       phone_number
//       address
//       role
//       drawing2Dfiles {
//         id
//         filename
//         fileUrl
//       }
//       drawing3Dfiles {
//         id
//         filename
//         fileUrl
//       }
//       drawingBOQfiles {
//         id
//         filename
//         fileUrl
//       }
//     }
//   }
// `;

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
    }
  }
`;

// Access Control

export const ADD_EMPLOYEE = gql`
  mutation UploadAccessControlUsers($email: String!, $password: String!) {
    uploadAccessControlUsers(email: $email, password: $password) {
      id
      email
      role
    }
  }
`;

export const GET_ALL_EMPLOYEE_LISTS = gql`
  query getAllEmployeeLists {
    getAllAccessControlUsers {
      id
      email
      role
    }
  }
`;

// export const UPLOAD_FILE_MUTATION = gql`
//   mutation createFileForBOQ($fileUrl: String!, $filename: String!) {
//     createFileForBOQ(fileUrl: $fileUrl, filename: $filename) {
//       id
//       filename
//       fileUrl
//       userId
//       version
//       createdAt
//     }
//   }
// `;

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
