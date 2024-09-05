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
    login(email: $email, password: $password)
  }
`;

export const USER = gql`
  query User($userId: Int!) {
    user(id: $userId) {
      id
      username
      email
    }
  }
`;
