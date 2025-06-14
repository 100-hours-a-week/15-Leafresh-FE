import NoContent from '@shared/components/no-content/no-content'
import { responsiveHorizontalPadding } from '@shared/styles/ResponsiveStyle'

import styled from '@emotion/styled'

export const Section = styled.section`
  display: flex;
  flex-direction: column;
`

export const SectionTitle = styled.h2`
  ${responsiveHorizontalPadding};
  font-size: ${({ theme }) => theme.fontSize.lg};
  font-weight: ${({ theme }) => theme.fontWeight.semiBold};
`

export const SearchBar = styled.div`
  padding: 10px 0;
`

export const SearchInput = styled.input`
  width: 100%;
  height: 40px;
  padding: 10px 15px 10px 35px;
  border-radius: 6px;
  border: none;
  background-color: ${({ theme }) => theme.colors.lfInputBackground};
  font-size: ${({ theme }) => theme.fontSize.sm};
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='%23999' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Ccircle cx='11' cy='11' r='8'%3E%3C/circle%3E%3Cline x1='21' y1='21' x2='16.65' y2='16.65'%3E%3C/line%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: 12px center;
  background-size: 16px;
  box-shadow: ${({ theme }) => theme.shadow.lfInput};
`

export const CategoryGrid = styled.div`
  padding: 0 20px;
  margin-top: 8px;
  display: grid;
  gap: 4px;
  grid-template-columns: repeat(8, 1fr);
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

export const ChallengeList = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  gap: 24px;
  padding: 0 16px;
  margin-top: 24px;
`

export const ObserverTrigger = styled.div`
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 1px;
`

export const StyledNoContent = styled(NoContent)`
  margin: 60px 0;
`

export const EndMessage = styled.div`
  text-align: center;
  font-size: ${({ theme }) => theme.fontSize.sm};
  color: ${({ theme }) => theme.colors.lfDarkGray.base};
`
