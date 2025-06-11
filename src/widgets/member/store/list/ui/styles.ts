import NoContent from '@shared/components/no-content/no-content'
import { responsiveHorizontalPadding } from '@shared/styles/ResponsiveStyle'

import styled from '@emotion/styled'

export const Container = styled.div`
  ${responsiveHorizontalPadding};
  height: 100%;

  display: flex;
  flex-direction: column;
  gap: 16px;
`

export const Header = styled.div`
  /* padding: 16px; */

  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`

export const Title = styled.h1`
  font-size: ${({ theme }) => theme.fontSize.lg};
  font-weight: ${({ theme }) => theme.fontWeight.bold};
`

export const LinkButton = styled.button`
  margin: 6px 0;

  align-self: flex-end;
  font-size: ${({ theme }) => theme.fontSize.sm};
  color: ${({ theme }) => theme.colors.lfBlue.base};
  font-weight: ${({ theme }) => theme.fontWeight.medium};

  cursor: pointer;
`

export const Grid = styled.div<{ isEmpty?: boolean }>`
  display: grid;

  ${({ isEmpty }) =>
    isEmpty
      ? `
      height: 100%;
    grid-template-columns: 1fr;
    place-items: center;
    min-height: 40vh;
  `
      : `
    grid-template-columns: repeat(2, 1fr);
    row-gap: 16px;
    column-gap: 20px;
  `}
`

export const Card = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;
`

export const ThumbnailWrapper = styled.div`
  position: relative;
  aspect-ratio: 1/1;
  border-radius: ${({ theme }) => theme.radius.base};
  overflow: hidden;
`

export const ProductTitle = styled.div`
  margin: 12px 0 6px 0;
  font-size: ${({ theme }) => theme.fontSize.base};
  font-weight: ${({ theme }) => theme.fontWeight.semiBold};

  display: -webkit-box;
  -webkit-line-clamp: 2; // 최대 줄 수
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
  word-break: break-word;
`

export const InfoRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: ${({ theme }) => theme.fontSize.sm};
`

export const TimeAgo = styled.span`
  color: ${({ theme }) => theme.colors.lfDarkGray.base};
`

export const PriceRow = styled.div`
  display: flex;
  align-items: center;
  gap: 4px;
`

export const Price = styled.span`
  font-weight: ${({ theme }) => theme.fontWeight.semiBold};
  color: ${({ theme }) => theme.colors.lfBlack.base};
`

export const Observer = styled.div`
  height: 1px;
`

export const StyledNoContent = styled(NoContent)`
  height: 100%;
`
