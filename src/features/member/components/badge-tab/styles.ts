import Image from 'next/image'

import styled from '@emotion/styled'

import { responsiveHorizontalPadding } from '@/shared/styles'

export const Container = styled.div`
  display: flex;
  flex-direction: column;
`

export const TabBar = styled.div`
  position: relative;
  display: flex;
  justify-content: space-between;
  background: white;
  border-bottom: 1px solid ${({ theme }) => theme.colors.lfLightGray.base};
`

export const TabButton = styled.button<{ isActive: boolean }>`
  background: none;
  border: none;
  flex: 1;
  height: 40px;
  font-size: ${({ theme }) => theme.fontSize.sm};
  font-weight: ${({ isActive, theme }) => (isActive ? theme.fontWeight.semiBold : theme.fontWeight.regular)};
  color: ${({ isActive, theme }) => (isActive ? theme.colors.lfGreenMain.base : theme.colors.lfBlack.base)};
  cursor: pointer;
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
  z-index: 1;
`

export const UnderlineWrapper = styled.div<{ tabCount: number }>`
  position: absolute;
  bottom: 0;
  width: 100%;
  display: flex;
`

export const Underline = styled.div<{ $index: number }>`
  width: 100%;
  max-width: calc(100% / 5);
  height: 2px;
  background-color: ${({ theme }) => theme.colors.lfGreenMain.base};
  transform: translateX(${({ $index }) => $index * 100}%);
  transition: transform 0.3s ease;
`

export const GridWrapper = styled.div`
  ${responsiveHorizontalPadding};
  position: relative;
`

export const FadeGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  column-gap: 24px;
  row-gap: 24px;
  padding: 24px 0;

  animation: fadeIn 0.5s ease;

  @keyframes fadeIn {
    from {
      opacity: 0;
    }
    to {
      opacity: 1;
    }
  }
`

export const Item = styled.div`
  width: 100%; // 중요!
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 6px;
  position: relative;
  cursor: pointer;
`

export const BadgeImageWrapper = styled.div`
  position: relative;
  width: 100%;
  aspect-ratio: 1 / 1;
  border-radius: 8px;
  overflow: hidden;
`

export const BadgeImage = styled(Image)`
  width: 100%;
  aspect-ratio: 1 / 1;
  object-fit: cover;
  border-radius: 8px;
`

export const Name = styled.span<{ isLocked: boolean }>`
  font-size: ${({ theme }) => theme.fontSize.base};
  font-weight: ${({ theme }) => theme.fontWeight.medium};
  padding-top: 5px;
  color: ${({ theme }) => theme.colors.lfBlack.base};
  text-align: center;
  max-width: 80px;
  line-height: 1.3;
`
