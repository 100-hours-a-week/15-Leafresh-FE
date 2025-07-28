import styled from '@emotion/styled'

import { ApologizeFeedback, LeafReward, Loading } from '@/shared/components'
import { responsiveHorizontalPadding } from '@/shared/styles'
export const ContentWrapper = styled.div<{ hasProducts: boolean }>`
  flex: 1;

  ${responsiveHorizontalPadding};
  margin-top: 20px;

  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
`

export const ProductGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 12px;
  margin-top: 8px;
`

export const SearchBar = styled.form`
  width: 100%;
  padding-bottom: 10px;
`

export const SearchInput = styled.input`
  width: 100%;
  height: 45px;
  padding: 10px 15px 10px 35px;
  border-radius: ${({ theme }) => theme.radius.md};
  border: 1px solid ${({ theme }) => theme.colors.lfGray.base};
  background-color: ${({ theme }) => theme.colors.lfWhite.base};
  font-size: ${({ theme }) => theme.fontSize.sm};
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='%23999' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Ccircle cx='11' cy='11' r='8'%3E%3C/circle%3E%3Cline x1='21' y1='21' x2='16.65' y2='16.65'%3E%3C/line%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: 12px center;
  background-size: 16px;
`

export const ObserverTrigger = styled.div`
  height: 1px;
`
export const StyledLoading = styled(Loading)`
  height: 100%;
  grid-column: span 2;
`

export const StyledApologizeFeedback = styled(ApologizeFeedback)`
  flex: 1;

  display: flex;
  justify-content: center;
`

export const StyledLeafReward = styled(LeafReward)`
  align-self: flex-end;
  position: relative;
`
