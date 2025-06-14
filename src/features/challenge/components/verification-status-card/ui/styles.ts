import styled from '@emotion/styled'

export const Card = styled.div`
  width: 150px;
  height: 140px;
  border-radius: ${({ theme }) => theme.radius.sm};
  overflow: hidden;
  background: ${({ theme }) => theme.colors.lfLightGray.base};
  box-shadow: ${({ theme }) => theme.shadow.lfPrime};
  display: flex;
  flex-direction: column;
`

export const ImageWrapper = styled.div`
  position: relative;
  width: 100%;
  padding-top: 115px;
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
  height: 28px;
  background: ${({ bg }) => bg};
  display: flex;
  align-items: center;
  justify-content: center;
`
