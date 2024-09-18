"use client";
import {
  ApolloClient,
  InMemoryCache,
  HttpLink,
  ApolloLink,
} from "@apollo/client";
import { setContext } from "@apollo/client/link/context";
import { getSession } from "next-auth/react";
import createUploadLink from "apollo-upload-client/createUploadLink.mjs";

const getGraphqlUri = () =>
  process.env.NODE_ENV === "production"
    ? "https://ensileta-portal.vercel.app/api/graphql"
    : "http://localhost:3000/api/graphql";

const httpLink = new HttpLink({
  uri: getGraphqlUri(),
});

const uploadLink = createUploadLink({
  uri: getGraphqlUri(),
});

const authLink = setContext(async (_, { headers }) => {
  try {
    const session = await getSession();
    const token = session?.accessToken;

    if (!token) {
      console.warn("No access token found. Sending request without token.");
      return { headers };
    }

    return {
      headers: {
        ...headers,
        authorization: `Bearer ${token}`,
      },
    };
  } catch (error) {
    console.error("Error retrieving session:", error);
    return { headers };
  }
});

const client = new ApolloClient({
  link: ApolloLink.from([authLink, httpLink, uploadLink]),
  // link: createUploadLink({ uri: '/api/graphql' }),
  cache: new InMemoryCache(),
  // credentials: "same-origin",
});

export default client;
