import Image from 'next/image'

import styled from '@emotion/styled'

export const StyledImage = styled(Image)`
  position: absolute;
  bottom: 90px;
  margin-left: auto;
  right: 16px;

  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  cursor: pointer;

  transition: transform 0.3s ease;

  &:hover {
    transform: scale(1.1);
  }

  &:active {
    transform: scale(0.95);
  }
`

export const Backdrop = styled.div`
  position: fixed;
  inset: 0;
  background-color: rgba(0, 0, 0, 0.4);
  z-index: 1000;
`
