import { media } from '@shared/styles/emotion/media'

import styled from '@emotion/styled'

export const Container = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
`

export const TabMenu = styled.div`
  position: relative;
  display: flex;
  width: 100%;
  border-bottom: 1px solid #ccc;
`

export const TabItem = styled.button<{ active: boolean }>`
  flex: 1;
  padding: 16px;
  text-align: center;
  font-weight: ${({ theme }) => theme.fontWeight.semiBold};
  font-size: ${({ theme }) => theme.fontSize.base};
  color: ${({ active, theme }) => (active ? theme.colors.lfBlack.base : theme.colors.lfDarkGray.base)};
  background: none;
  border: none;
  cursor: pointer;

  ${media.afterMobile} {
    font-size: ${({ theme }) => theme.fontSize.md};
  }
`

export const Underline = styled.div<{ $index: number }>`
  position: absolute;
  bottom: 0;
  left: 0;
  width: 50%;
  height: 2px;
  background-color: ${({ theme }) => theme.colors.lfGreenMain.base};
  transform: translateX(${({ $index }) => $index * 100}%);
  transition: transform 0.2s ease;
`
