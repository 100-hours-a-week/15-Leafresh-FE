import isPropValid from '@emotion/is-prop-valid'
import styled from '@emotion/styled'

export const Wrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
`

export const StyledIcon = styled('svg', {
  shouldForwardProp: prop => isPropValid(prop) && prop !== 'hasClick',
})<{ size: number; hasClick: boolean }>`
  width: ${({ size }) => size}px;
  height: ${({ size }) => size}px;
  ${({ hasClick }) => hasClick && 'cursor: pointer;'}
`
