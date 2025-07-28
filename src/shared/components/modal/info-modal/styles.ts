import styled from '@emotion/styled'

export const Overlay = styled.div`
  position: absolute;
  inset: 0;
  background-color: ${({ theme }) => theme.colors.lfBackdrop.base};
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
`

export const ModalContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  background-color: ${({ theme }) => theme.colors.lfWhite.base};
  border-radius: ${({ theme }) => theme.radius.base};
  width: 278px;
  min-height: 110px;
`

export const ContentWrapper = styled.div`
  padding: 15px 17px 0;
  flex-grow: 1;
`

export const Title = styled.h2`
  margin: 0;
  font-size: ${({ theme }) => theme.fontSize.base};
  font-weight: ${({ theme }) => theme.fontWeight.medium};
  color: ${({ theme }) => theme.colors.lfBlack.base};
`

export const Description = styled.p`
  margin: 15px 0 0;
  font-size: ${({ theme }) => theme.fontSize.xs};
  color: ${({ theme }) => theme.colors.lfDarkGray.base};
  font-weight: ${({ theme }) => theme.fontWeight.regular};
`
//확인 버튼은 다른 padding값을 받기 때문에 Wrapper를 나누어 관리, 또한 항상 가장 하단에 위치
export const ButtonWrapper = styled.div`
  display: flex;
  justify-content: flex-end;
  margin-top: 0px;
  padding: 0 4px 11px;
`

export const ConfirmButton = styled.button`
  cursor: pointer;
  background: none;
  border: none;
  color: ${({ theme }) => theme.colors.lfBlue.base};
  font-size: ${({ theme }) => theme.fontSize.sm};
  font-weight: ${({ theme }) => theme.fontWeight.medium};
  padding: 9.5px 14.5px;
`
