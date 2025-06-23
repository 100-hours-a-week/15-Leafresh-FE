'use client'
import { ReactNode } from 'react'

import { ChakraProvider, defaultSystem } from '@chakra-ui/react'

/**
 * ChakraUI의 Provider
 */
export function ChakraUseProvider({ children }: { children: ReactNode }) {
  return <ChakraProvider value={defaultSystem}>{children}</ChakraProvider>
}
