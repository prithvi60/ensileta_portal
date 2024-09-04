import { gql } from "@apollo/client";

export const SIGN_UP = gql`
  mutation signUp(
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
    )
  }
`;

export const LOGIN = gql`
  mutation login($email: String!, $password: String!) {
    login(email: $email, password: $password)
  }
`;
