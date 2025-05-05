'use client'

import { ReactNode } from 'react'
import { QueryClientProvider } from '@tanstack/react-query'

import { queryClient } from '../tanstack-query/queryClient'

interface Props {
  children: ReactNode
}

export default function TanstackQueryProvider({ children }: Props) {
  return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
}
