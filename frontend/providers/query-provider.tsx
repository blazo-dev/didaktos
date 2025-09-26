"use client"

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactNode, useState } from 'react';

interface QueryProviderProps {
    children: ReactNode
}

function QueryProvider({ children }: QueryProviderProps) {
    const [queryClient] = useState(() => new QueryClient({
        defaultOptions: {
            queries: {
                staleTime: 5 * 60 * 1000 // 5 minutes
            }
        }
    }));

    return (
        <QueryClientProvider
            client={queryClient}
        >
            {children}
        </QueryClientProvider>
    )
}

export default QueryProvider