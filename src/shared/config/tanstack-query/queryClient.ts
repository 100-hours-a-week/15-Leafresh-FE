import { QueryClient } from '@tanstack/react-query'

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

const queryClient = new QueryClient(options)

export const getQueryClient = () => {
  return queryClient
}
