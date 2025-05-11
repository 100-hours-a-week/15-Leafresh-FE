import { QueryClient } from '@tanstack/react-query'

const options = {
  defaultOptions: {
    queries: {
      retry: 0,
      refetchOnWindowFocus: false,
    },
  },
}

export const queryClient = new QueryClient(options)
