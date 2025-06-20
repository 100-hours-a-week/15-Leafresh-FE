'use client'
import { ReactNode } from 'react'

import { getQueryClient } from '@/shared/config'
import { QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'

interface Props {
  children: ReactNode
}

export function TanstackQueryProvider({ children }: Props) {
  return (
    <QueryClientProvider client={getQueryClient()}>
      {children}
      <ReactQueryDevtools />
    </QueryClientProvider>
  )
}
