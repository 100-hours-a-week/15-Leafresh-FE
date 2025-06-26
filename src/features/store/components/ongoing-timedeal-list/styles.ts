import styled from '@emotion/styled'

import { ApologizeContent } from '@/shared/components'
import { media } from '@/shared/config'

export const Container = styled.section`
  margin: 20px 0;
  width: 100%;
  position: relative;
  cursor: pointer;
`
export const TitleBox = styled.div`
  margin-bottom: 12px;
`

export const SectionTitle = styled.h2`
  font-size: ${({ theme }) => theme.fontSize.lg};
  font-weight: ${({ theme }) => theme.fontWeight.bold};
`

export const SubText = styled.p`
  margin: 8px 0px;
  color: ${({ theme }) => theme.colors.lfDarkGray.base};
  font-size: ${({ theme }) => theme.fontSize.sm};

  ${media.afterMobile} {
    font-size: ${({ theme }) => theme.fontSize.base};
  }
`

export const CarouselWrapper = styled.div`
  width: 100%;

  position: relative;
`
export const Embla = styled.div`
  padding: 6px 0;
  overflow: hidden;
`
export const EmblaTrack = styled.div`
  display: flex;
`

export const MoveButton = styled.button`
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  background: ${({ theme }) => theme.colors.lfWhite.base};
  border-radius: ${({ theme }) => theme.radius.full};
  box-shadow: ${({ theme }) => theme.shadow.lfInput};
  width: 36px;
  height: 36px;
  z-index: 10;

  cursor: pointer;

  &:hover {
    background-color: ${({ theme }) => theme.colors.lfInputBackground.base};
  }
`

export const LeftButton = styled(MoveButton)`
  left: 0;
`
export const RightButton = styled(LeftButton)`
  left: auto;
  right: 0;
`

export const StyledApologizeContent = styled(ApologizeContent)`
  margin: 24px 0;
`
