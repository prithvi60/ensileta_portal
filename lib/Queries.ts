import { gql } from "@apollo/client";

export const SIGN_UP = gql`
  mutation sigUp(
    $username: String!
    $email: String!
    $password: String!
    $confirmPassword: String!
  ) {
    signUp(
      username: $username
      email: $email
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

export const GET_USER_PROFILE = gql`
  query GetUserProfile {
    userProfile {
      username
      email
      id
    }
  }
`;

export const UPLOAD_FILE = gql`
  mutation UploadPDF($file: Upload!) {
    uploadPDF(file: $file) {
      id
      filename
      fileUrl
      createdAt
    }
  }
`;

export const ADD_2D_FILENAME = gql`
  mutation Upload2DFile($fileName: String!) {
    upload2DFile(fileName: $fileName) {
      id
      fileName
      fileURL
      version
      createdAt
    }
  }
`;

export const GET_ALL_2D_VIEW = gql`
  query GetAll2DFiles {
    getAll2DFiles(orderBy: { createdAt: desc }) {
      id
      fileName
      fileURL
      version
      createdAt
    }
  }
`;

export const ADD_3D_FILENAME = gql`
  mutation Upload3DFile($fileName: String!) {
    upload3DFile(fileName: $fileName) {
      id
      fileName
      fileURL
      version
      createdAt
    }
  }
`;

export const GET_ALL_3D_VIEW = gql`
  query GetAll3DFiles {
    getAll3DFiles(orderBy: { createdAt: desc }) {
      id
      fileName
      fileURL
      version
      createdAt
    }
  }
`;

export const ADD_BOQ_FILENAME = gql`
  mutation UploadBOQFile($fileName: String!) {
    uploadBOQFile(fileName: $fileName) {
      id
      fileName
      fileURL
      version
      createdAt
    }
  }
`;

export const GET_ALL_BOQ_VIEW = gql`
  query GetAllBOQFiles {
    getAllBOQFiles(orderBy: { createdAt: desc }) {
      id
      fileName
      fileURL
      version
      createdAt
    }
  }
`;
