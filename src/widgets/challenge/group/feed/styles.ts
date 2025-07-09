import styled from '@emotion/styled'

import { responsiveHorizontalPadding } from '@/shared/styles'

export const Wrapper = styled.div`
  height: 100%;

  position: relative;
  display: flex;
  flex-direction: column;
`

export const CategoryGrid = styled.div`
  ${responsiveHorizontalPadding};

  margin-top: 8px;
  display: grid;
  gap: 4px;
  grid-template-columns: repeat(9, 1fr);
  overflow-x: auto;

  &::-webkit-scrollbar {
    display: none;
  }
  -ms-overflow-style: none;
  scrollbar-width: none;
`

export const CategoryItem = styled.div<{ isActive: boolean }>`
  aspect-ratio: 1/1;
  border-radius: ${({ theme }) => theme.radius.lg};
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 12px;
  font-size: ${({ theme }) => theme.fontSize.sm};
  cursor: pointer;

  background-color: ${({ isActive }) => (isActive ? '#f5eee4' : 'transparent')};

  &:hover {
    background-color: #f5eee4;
  }
`

export const CategoryLabel = styled.span`
  font-size: ${({ theme }) => theme.fontSize.xs};
  font-weight: ${({ theme }) => theme.fontWeight.medium};
  color: ${({ theme }) => theme.colors.lfBlack.base};
`

export const TextWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`
export const FeedTitle = styled.div`
  ${responsiveHorizontalPadding};
  padding-bottom: 10px;

  font-size: ${({ theme }) => theme.fontSize.lg};
  font-weight: ${({ theme }) => theme.fontWeight.semiBold};
`

export const FeedSubtitle = styled.div`
  ${responsiveHorizontalPadding};

  color: ${({ theme }) => theme.colors.lfGreenMain.base};
  font-size: ${({ theme }) => theme.fontSize.sm};
  font-weight: ${({ theme }) => theme.fontWeight.medium};
`
