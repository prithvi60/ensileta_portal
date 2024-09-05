import {
  ApolloClient,
  InMemoryCache,
  HttpLink,
  ApolloLink,
} from "@apollo/client";
import { setContext } from "@apollo/client/link/context";
import { getSession } from "next-auth/react";

const httpLink = new HttpLink({
  uri:
    process.env.NODE_ENV === "production"
      ? "https://ensileta-portal.vercel.app/api/graphql"
      : "http://localhost:3000/api/graphql",
});

const authLink = setContext(async (_, { headers }) => {
  const session = await getSession();
  const token = session?.accessToken;

  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : "",
    },
  };
});

const client = new ApolloClient({
  link: ApolloLink.from([authLink, httpLink]),
  cache: new InMemoryCache(),
});

export default client;
