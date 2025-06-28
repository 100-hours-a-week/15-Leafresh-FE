import Image from 'next/image'

import styled from '@emotion/styled'

import { ThemeColorType, ThemeFontSizeType } from '@/shared/config'
import { getThemeColor, getThemeFontSize } from '@/shared/lib'

export const Wrapper = styled.div`
  width: 120px;
  position: relative;
  border-radius: ${({ theme }) => theme.radius.md};
  overflow: hidden;
`

export const ImageBox = styled.div<{ aspectRatio: string }>`
  width: 100%;
  aspect-ratio: ${({ aspectRatio }) => aspectRatio};
  position: relative;
  overflow: hidden;
  box-shadow: ${({ theme }) => theme.shadow.lfPrime};

  display: flex;
  align-items: center;
  justify-content: center;
`

export const PreviewImage = styled(Image)`
  object-fit: cover;
  object-position: center center;
`

export const RemoveButton = styled.button`
  position: absolute;
  top: 2px;
  right: 2px;
  background: transparent;
  border: none;
  padding: 4px;
  cursor: pointer;
`

export const EmptyBox = styled.div<{ backgroundColor: ThemeColorType; readOnly: boolean; aspectRatio: string }>`
  width: 100%;
  aspect-ratio: ${({ aspectRatio }) => aspectRatio};
  background-color: ${({ backgroundColor }) => getThemeColor(backgroundColor)};
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 8px;
  cursor: pointer;
`

export const Text = styled.p<{ fontSize: ThemeFontSizeType }>`
  text-align: center;
  font-size: ${({ fontSize }) => getThemeFontSize(fontSize)};
  font-weight: ${({ theme }) => theme.fontWeight.medium};
  color: ${({ theme }) => theme.colors.lfBlack.base};
  white-space: pre-line;
  line-height: 1.2;
`
