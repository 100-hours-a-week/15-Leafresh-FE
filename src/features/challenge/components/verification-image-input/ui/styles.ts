import ImageInput from '@shared/components/image-input/ui/image-input'
import { ThemeColorType } from '@shared/config/style/type'
import { getThemeColor } from '@shared/lib/utils/theme-utils'

import styled from '@emotion/styled'

export const Container = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 120px;
  flex-shrink: 0;
`

export const ImageArea = styled.div`
  position: relative;
  width: 100%;
`

export const StyledImageInput = styled(ImageInput)`
  width: 100%;
  border-bottom-left-radius: 0;
  border-bottom-right-radius: 0;
`

export const Footer = styled.div<{ backgroundColor: ThemeColorType }>`
  width: 100%;
  height: 28px;
  border-bottom-left-radius: ${({ theme }) => theme.radius.md};
  border-bottom-right-radius: ${({ theme }) => theme.radius.md};
  background-color: ${({ backgroundColor }) => getThemeColor(backgroundColor)};
  display: flex;
  align-items: center;
  justify-content: center;
`

export const Description = styled.p`
  font-size: ${({ theme }) => theme.fontSize.xs};
  font-weight: ${({ theme }) => theme.fontWeight.medium};
  color: ${({ theme }) => theme.colors.lfBlack.base};
  text-align: center;
  margin-top: 8px;
  line-height: 130%;
  word-break: break-word;
  white-space: pre-wrap;
`
export const ZoomButton = styled.button`
  position: absolute;
  bottom: 4px;
  right: 4px;
  background: transparent;
  border: none;
  padding: 4px;
  cursor: pointer;
`
