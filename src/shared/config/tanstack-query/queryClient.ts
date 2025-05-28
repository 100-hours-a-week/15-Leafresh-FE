import { isServer, QueryClient } from '@tanstack/react-query'

const options = {
  defaultOptions: {
    queries: {
      retry: 0,
      refetchOnWindowFocus: false,
      staleTime: 0, // 즉시 무효화 처리 (지정한 경우에만 즉시 캐싱)
      gcTime: 1000 * 60 * 5, // 언마운트 후 5분 동안 메모리 캐시 유지
    },
    mutations: {
      retry: 0, // 실패시 재시도하지 않음 (필요시 지정)
    },
  },
}

let browserQueryClient: QueryClient | undefined = undefined

const makeQueryClient = () => {
  return new QueryClient(options)
}

// export const getQueryClient = () => {
//   return queryClient
// }

export const getQueryClient = () => {
  if (isServer) {
    // Server: always make a new query client
    return makeQueryClient()
  } else {
    // Browser: make a new query client if we don't already have one
    // This is very important, so we don't re-make a new client if React
    // suspends during the initial render. This may not be needed if we
    // have a suspense boundary BELOW the creation of the query client
    if (!browserQueryClient) browserQueryClient = makeQueryClient()
    return browserQueryClient
  }
}
