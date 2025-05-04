'use client'

import { useRef } from 'react'
import styled from '@emotion/styled'
import { theme } from '@shared/styles/theme'

import { useOutsideClick } from '@shared/hooks/useOutsideClick/useOutsideClick'
import { useKeyClose } from '@shared/hooks/useKeyClose/useKeyClose'
import { useScrollLock } from '@shared/hooks/useScrollLock/useScrollLock'

import { useInfoModalStore, InfoModalVariant } from '@shared/context/InfoModal/InfomodalStore'

const InfoModal = () => {
  const {
    isOpen,
    title,
    description,
    variant,
    onClose,
    onCancel,
    closeInfoModal,
  } = useInfoModalStore()

  const modalRef = useRef<HTMLDivElement>(null)

  const handleClose = () => {
    onClose?.()
    closeInfoModal()
  }

  useOutsideClick(modalRef as React.RefObject<HTMLElement>, handleClose)
  useKeyClose('Escape', modalRef as React.RefObject<HTMLElement>, handleClose)
  useScrollLock()

  if (!isOpen) return null

  return (
    <Overlay>
      <ModalContainer ref={modalRef} variant={variant}>
        <ContentWrapper variant={variant}>
            <Title>{title}</Title>
            {description && variant !== 'minimal' && <Description variant={variant}>{description}</Description>}
        </ContentWrapper>

        <ButtonWrapper variant={variant}>
          <ConfirmButton variant={variant} onClick={handleClose}>
            확인
          </ConfirmButton>
          {variant === 'long' && (
            <CancelButton onClick={handleClose}>
              취소
            </CancelButton>
          )}
        </ButtonWrapper>
      </ModalContainer>
    </Overlay>
  )
}

export default InfoModal

// 스타일

const Overlay = styled.div`
  position: fixed;
  inset: 0;
  background-color: ${theme.colors.lfBackdrop.base};
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
`

const ModalContainer = styled.div<{ variant: InfoModalVariant }>`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  background-color: ${theme.colors.lfWhite.base};
  border-radius: ${theme.radius.base};
  /* padding: ${({ variant }) => (variant === 'long' ? '12px' : '17px')}; */
  width: ${({variant}) => (variant === 'long' ? '260px' : '278px')};
  min-height: 110px;
`

const ContentWrapper = styled.div<{ variant: InfoModalVariant }>`
    padding: ${({ variant }) => (variant === 'long' ? '12px 12px 0' : '15px 17px 0')};
    flex-grow: 1;
`

const Title = styled.h2`
  margin: 0;
  font-size: ${theme.fontSize.base};
  font-weight: ${theme.fontWeight.medium};
  color: ${theme.colors.lfBlack.base};
`

const Description = styled.p<{ variant: InfoModalVariant }>`
  margin: ${({ variant }) => (variant === 'long' ? '15px 0' : '15px 0 0')};
  font-size: ${theme.fontSize.xs};
  color: ${theme.colors.lfDarkGray.base};
  font-weight: ${theme.fontWeight.regular};
`
//확인 버튼은 다른 padding값을 받기 때문에 Wrapper를 나누어 관리, 또한한 항상 가장 하단에 위치
const ButtonWrapper = styled.div<{ variant: InfoModalVariant }>`
  display: flex;
  flex-direction: ${({ variant }) => (variant === 'long' ? 'column' : 'row')};
  justify-content: ${({ variant }) => variant === 'long' ? 'center' : 'flex-end'};
  margin-top: ${({ variant }) => (variant === 'long' ? '24px' : '0px')};
  padding: ${({ variant }) => (variant === 'long' ? '0 17px 16px' : '0 4px 11px')};
  gap: ${({ variant }) => (variant === 'long' ? '9px' : '0')};
`

const ConfirmButton = styled.button<{ variant: InfoModalVariant }>`
  cursor: pointer;
  ${({ variant }) =>
    variant === 'long' ?
    `
      background-color: ${theme.colors.lfGreenMain.base};
      color: ${theme.colors.lfWhite.base};
      border: none;
      border-radius: ${theme.radius.sm};
      padding: '12px'
      font-size: ${theme.fontSize.base};
      width: 'auto'
      height: '33px'
    ` :
    `
      background: none;
      border: none;
      color: ${theme.colors.lfBlue.base};
      font-size: ${theme.fontSize.sm};
      font-weight: ${theme.fontWeight.medium}
    `
  };
  padding: ${({variant}) => (variant === 'long' ? '7px' : '9.5px 14.5px')};
`

const CancelButton = styled.button`
  background: none;
  border: none;
  color: ${theme.colors.lfGray.base};
  font-size: ${theme.fontSize.sm};
  cursor: pointer;
`
