"use client"

import client from '@/lib/apolloClient';
import { ApolloClient, InMemoryCache, ApolloProvider } from '@apollo/client';
import { SessionProvider } from 'next-auth/react';


export function Providers({ children }: { children: React.ReactNode }) {
    // const client = new ApolloClient({
    //     uri: process.env.NODE_ENV === "production" ? "https://ensileta-portal.vercel.app/api/graphql" : "http://localhost:3000/api/graphql",
    //     // uri: 'https://ensileta-portal.vercel.app/'http://localhost:3000/api/graphql',
    //     cache: new InMemoryCache(),
    // });
    return (
        <SessionProvider>
            <ApolloProvider client={client} >
                {children}
            </ApolloProvider>
        </SessionProvider>
    )
}

