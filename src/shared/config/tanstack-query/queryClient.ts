import { QueryClient } from '@tanstack/react-query'

const options = {
  defaultOptions: {
    queries: {
      retry: 0,
      refetchOnWindowFocus: false,
    },
  },
}

const queryClient = new QueryClient(options)

export const getQueryClient = () => {
  return queryClient
}
