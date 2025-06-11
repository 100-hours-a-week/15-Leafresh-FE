'use client'
import { useRef } from 'react'

import { useConfirmModalStore } from '@shared/context/modal/ConfirmModalStore'
import { useKeyClose } from '@shared/hooks/useKeyClose/useKeyClose'
import { useOutsideClick } from '@shared/hooks/useOutsideClick/useOutsideClick'
import { useScrollLock } from '@shared/hooks/useScrollLock/useScrollLock'
import { theme } from '@shared/styles/theme'

import styled from '@emotion/styled'

const ConfirmModal = () => {
  const { isOpen, title, description, onConfirm, onCancel, closeConfirmModal } = useConfirmModalStore()
  const modalRef = useRef<HTMLDivElement>(null)

  const handleConfirm = () => {
    onConfirm()
    closeConfirmModal()
  }

  const handleCancel = () => {
    onCancel?.()
    closeConfirmModal()
  }

  // Custom Hooks
  useOutsideClick(modalRef as React.RefObject<HTMLElement>, handleCancel)
  useKeyClose('Escape', modalRef as React.RefObject<HTMLElement>, handleCancel)
  useScrollLock(isOpen)

  if (!isOpen) return null
  return (
    <Overlay>
      <ModalContainer ref={modalRef}>
        <Title>{title}</Title>
        <Description>{description}</Description>
        <ButtonGroup>
          <CancelButton onClick={handleCancel}>취소</CancelButton>
          <ConfirmButton onClick={handleConfirm}>확인</ConfirmButton>
        </ButtonGroup>
      </ModalContainer>
    </Overlay>
  )
}

export default ConfirmModal

// === 스타일 ===
const Overlay = styled.div`
  width: 100%;

  position: absolute;
  inset: 0;
  z-index: 1000;
  background-color: ${theme.colors.lfBackdrop.base};
  /* opacity: 0.3; */

  display: flex;
  justify-content: center;
  align-items: center;
`

const ModalContainer = styled.div`
  width: 100%;
  min-width: 280px;
  max-width: 320px;

  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: flex-start;

  background-color: ${theme.colors.lfWhite.base};
  color: ${theme.colors.lfBlack.base};

  padding: 18px 24px;
  border-radius: ${theme.radius.lg};
  box-shadow: ${theme.shadow.lfPrime};

  text-align: center;
`

const Title = styled.h2`
  font-size: ${theme.fontSize.base};
  font-weight: ${theme.fontWeight.semiBold};
  text-align: left;

  margin-bottom: 12px;
  white-space: pre-line;
`

const Description = styled.p`
  font-size: ${theme.fontSize.sm};
  font-weight: ${theme.fontWeight.regular};
  text-align: left;

  color: ${theme.colors.lfDarkGray.base};
  margin: 2px 0 24px 0;
  white-space: pre-line;
`

const ButtonGroup = styled.div`
  width: 100%;

  font-size: ${theme.fontSize.sm};
  font-weight: ${theme.fontWeight.medium};

  display: flex;
  gap: 16px;
  justify-content: center;
`

const ConfirmButton = styled.button`
  flex: 1;
  padding: 12px 24px;

  color: ${theme.colors.lfWhite.base};
  background-color: ${theme.colors.lfGreenMain.base};
  border: none;
  border-radius: ${theme.radius.sm};

  cursor: pointer;

  &:hover {
    background-color: ${theme.colors.lfGreenMain.hover};
  }
`

const CancelButton = styled.button`
  flex: 1;
  padding: 12px 24px;

  color: ${theme.colors.lfGray.base};
  background-color: ${theme.colors.lfWhite.base};
  border: 1.5px solid ${theme.colors.lfGray.base};
  border-radius: ${theme.radius.sm};

  cursor: pointer;
`
