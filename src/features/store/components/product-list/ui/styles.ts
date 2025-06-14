import { responsiveHorizontalPadding } from '@shared/styles/ResponsiveStyle'

import styled from '@emotion/styled'

export const ContentWrapper = styled.div`
  ${responsiveHorizontalPadding};

  margin-top: 20px;
`

export const ProductGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 24px;
  margin-top: 8px;
`

export const SearchBar = styled.form`
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
