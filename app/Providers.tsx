"use client"
import { NextUIProvider } from '@nextui-org/system'
import { ApolloClient, InMemoryCache, ApolloProvider } from '@apollo/client';

export function Providers({ children }: { children: React.ReactNode }) {
    const client = new ApolloClient({
        // uri:process.env.NODE_ENV !== "production"? "http://localhost:3000/api/graphql":"https://webibee.com/api/graphql",
        uri: 'http://localhost:3000/api/graphql',
        cache: new InMemoryCache(),

    });
    return (
        <ApolloProvider client={client} >
            <NextUIProvider>
                {children}
            </NextUIProvider>
        </ApolloProvider>
    )
}