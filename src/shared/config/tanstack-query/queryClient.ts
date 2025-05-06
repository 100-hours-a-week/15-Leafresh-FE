import { QueryClient } from '@tanstack/react-query'

const options = {
  defaultOptions: {
    queries: {
      retry: 2,
      refetchOnWindowFocus: false,
    },
  },
}

export const queryClient = new QueryClient(options)
