import styled from '@emotion/styled'

export const Wrapper = styled.div`
  position: relative;
  display: inline-block;
`

// maxHeight : 보여주고 싶은 요소의 개수만큼의 높이
export const MenuWrapper = styled.ul<{ maxHeight: number }>`
  position: absolute;
  top: 100%;
  left: 0;
  width: 100%;

  max-height: ${({ maxHeight }) => `${maxHeight}px`};
  overflow-y: auto;

  margin-top: 8px;
  padding: 8px 4px;
  border-radius: ${({ theme }) => theme.radius.base};
  box-shadow: ${({ theme }) => theme.shadow.lfInput};
  background-color: ${({ theme }) => theme.colors.lfWhite.base};
  z-index: 10;
  list-style: none;
`
