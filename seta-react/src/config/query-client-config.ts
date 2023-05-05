import type { QueryClientConfig } from '@tanstack/react-query'

export const queryClientOptions: QueryClientConfig = {
  defaultOptions: {
    queries: {
      retry: false,
      staleTime: 60 * 1000 // 1 minute
    }
  }
}
