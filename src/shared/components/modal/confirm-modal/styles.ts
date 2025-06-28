import styled from '@emotion/styled'

export const Overlay = styled.div`
  width: 100%;

  position: absolute;
  inset: 0;
  z-index: 1000;
  background-color: ${({ theme }) => theme.colors.lfBackdrop.base};
  /* opacity: 0.3; */

  display: flex;
  justify-content: center;
  align-items: center;
`

export const ModalContainer = styled.div`
  width: 100%;
  min-width: 280px;
  max-width: 320px;

  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: flex-start;

  background-color: ${({ theme }) => theme.colors.lfWhite.base};
  color: ${({ theme }) => theme.colors.lfBlack.base};

  padding: 18px 24px;
  border-radius: ${({ theme }) => theme.radius.lg};
  box-shadow: ${({ theme }) => theme.shadow.lfPrime};

  text-align: center;
`

export const Title = styled.h2`
  font-size: ${({ theme }) => theme.fontSize.base};
  font-weight: ${({ theme }) => theme.fontWeight.semiBold};
  text-align: left;

  margin-bottom: 12px;
  white-space: pre-line;
`

export const Description = styled.p`
  font-size: ${({ theme }) => theme.fontSize.sm};
  font-weight: ${({ theme }) => theme.fontWeight.regular};
  text-align: left;

  color: ${({ theme }) => theme.colors.lfDarkGray.base};
  margin: 2px 0 24px 0;
  white-space: pre-line;
`

export const ButtonGroup = styled.div`
  width: 100%;

  font-size: ${({ theme }) => theme.fontSize.sm};
  font-weight: ${({ theme }) => theme.fontWeight.medium};

  display: flex;
  gap: 16px;
  justify-content: center;
`

export const ConfirmButton = styled.button`
  flex: 1;
  padding: 12px 24px;

  color: ${({ theme }) => theme.colors.lfWhite.base};
  background-color: ${({ theme }) => theme.colors.lfGreenMain.base};
  border: none;
  border-radius: ${({ theme }) => theme.radius.sm};

  cursor: pointer;

  &:hover {
    background-color: ${({ theme }) => theme.colors.lfGreenMain.hover};
  }
`

export const CancelButton = styled.button`
  flex: 1;
  padding: 12px 24px;

  color: ${({ theme }) => theme.colors.lfGray.base};
  background-color: ${({ theme }) => theme.colors.lfWhite.base};
  border: 1.5px solid ${({ theme }) => theme.colors.lfGray.base};
  border-radius: ${({ theme }) => theme.radius.sm};

  cursor: pointer;
`
