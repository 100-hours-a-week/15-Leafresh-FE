'use client'
import { ReactNode } from 'react'

import { getQueryClient } from '../tanstack-query/queryClient'

import { QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'

interface Props {
  children: ReactNode
}

export default function TanstackQueryProvider({ children }: Props) {
  return (
    <QueryClientProvider client={getQueryClient()}>
      {children}
      <ReactQueryDevtools />
    </QueryClientProvider>
  )
}
