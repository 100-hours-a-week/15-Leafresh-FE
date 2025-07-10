import styled from '@emotion/styled'

import { ASPECT_RATIO } from '@/shared/constants'

export const ThumbnailContainer = styled.div`
  width: 100%;
  aspect-ratio: ${ASPECT_RATIO.CHALLENGE.THUMBNAIL};

  border: 1px solid ${({ theme }) => theme.colors.lfGray.base};
  border-radius: ${({ theme }) => theme.radius.base};

  position: relative;
  cursor: pointer;
  overflow: hidden;
`

export const Thumbnail = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
`

export const Overlay = styled.div`
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);

  font-size: ${({ theme }) => theme.fontSize.xs};
  color: ${({ theme }) => theme.colors.lfBlack.base};

  display: flex;
  flex-direction: column;
  gap: 8px;

  position: absolute;
`

export const HiddenInput = styled.input`
  display: none;
`
