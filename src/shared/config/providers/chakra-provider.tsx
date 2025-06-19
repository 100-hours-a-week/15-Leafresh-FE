import { ReactNode } from 'react'
import { ChakraProvider, defaultSystem } from '@chakra-ui/react'

/**
 * Chakra UI의 Provider
 */
export function ChakraUseProvider({ children }: { children: ReactNode }) {
  return <ChakraProvider value={defaultSystem}>{children}</ChakraProvider>
}
