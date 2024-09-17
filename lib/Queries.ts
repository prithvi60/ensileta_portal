import { gql } from "@apollo/client";

// Authentication

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

// View 3D queries

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

// View BOQ queries

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
