import styled from '@emotion/styled'

export const Card = styled.div`
  width: 100%;
  /* aspect-ratio: 1/1; */

  overflow: hidden;

  position: relative;
  display: flex;
  flex-direction: column;

  border-radius: ${({ theme }) => theme.radius.sm};
  background: ${({ theme }) => theme.colors.lfLightGray.base};
  box-shadow: ${({ theme }) => theme.shadow.lfPrime};
`

export const ImageWrapper = styled.div`
  position: relative;
  width: 100%;
  aspect-ratio: 1/1;
  background: #eee;
`

export const StyledImg = styled.img`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
`

export const DayLabel = styled.div`
  position: absolute;
  top: 8px;
  right: 8px;
  background: rgba(255, 255, 255, 0.8);
  padding: 2px 4px;
  border-radius: ${({ theme }) => theme.radius.xs};
  font-size: ${({ theme }) => theme.fontSize.xs};
  color: ${({ theme }) => theme.colors.lfBlack.base};
`

export const BottomBar = styled.div<{ bg: string }>`
  width: 100%;
  height: 28px;

  bottom: 0;
  background: ${({ bg }) => bg};

  position: absolute;
  display: flex;
  align-items: center;
  justify-content: center;
`
