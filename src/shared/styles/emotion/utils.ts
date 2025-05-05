'use client'
import styled from '@emotion/styled'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const StyledGeneric = <TProps extends {}>(Component: React.FC<TProps>, ...interpolations: any[]) => styled(
  Component,
)<TProps>`
  ${interpolations}
`
