import Image from 'next/image'

import styled from '@emotion/styled'

export const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
`
export const Viewport = styled.div`
  overflow: hidden;
  width: 100%;
`

export const Track = styled.div`
  display: flex;
  gap: 8px;
`

export const Slide = styled.div`
  position: relative;
  flex: 0 0 33.3%;
  aspect-ratio: 1 / 1;
  padding: 4px;
  cursor: pointer;
`

export const StyledImage = styled(Image)`
  object-fit: cover;
  border-radius: ${({ theme }) => theme.radius.base};
`

export const Pagination = styled.div`
  display: flex;
  justify-content: center;
  gap: 6px;
  margin-top: 4px;
`

export const Dot = styled.button<{ active: boolean }>`
  width: 10px;
  height: 10px;
  border-radius: 50%;
  border: none;
  background-color: ${({ active, theme }) => (active ? theme.colors.lfGreenMain.base : theme.colors.lfLightGray.base)};
  cursor: pointer;
`
