'use client'
import { useRef } from 'react'

import { useConfirmModalStore } from '@shared/context/modal/confirm-modal-store'
import { useKeyClose } from '@shared/hooks/useKeyClose/useKeyClose'
import { useOutsideClick } from '@shared/hooks/useOutsideClick/useOutsideClick'
import { useScrollLock } from '@shared/hooks/useScrollLock/useScrollLock'

import * as S from './styles'

export const ConfirmModal = () => {
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
    <S.Overlay>
      <S.ModalContainer ref={modalRef}>
        <S.Title>{title}</S.Title>
        <S.Description>{description}</S.Description>
        <S.ButtonGroup>
          <S.CancelButton onClick={handleCancel}>취소</S.CancelButton>
          <S.ConfirmButton onClick={handleConfirm}>확인</S.ConfirmButton>
        </S.ButtonGroup>
      </S.ModalContainer>
    </S.Overlay>
  )
}
