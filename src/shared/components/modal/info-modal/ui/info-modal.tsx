'use client'

import { useRef } from 'react'

import { useInfoModalStore } from '@shared/context/modal/info-modal-store'
import { useKeyClose } from '@shared/hooks/useKeyClose/useKeyClose'
import { useOutsideClick } from '@shared/hooks/useOutsideClick/useOutsideClick'
import { useScrollLock } from '@shared/hooks/useScrollLock/useScrollLock'

import * as S from './styles'

export const InfoModal = () => {
  const { isOpen, title, description, variant, onClose, closeInfoModal } = useInfoModalStore()

  const modalRef = useRef<HTMLDivElement>(null)
  const isRegular = description && variant !== 'minimal'

  const handleClose = () => {
    onClose?.()
    closeInfoModal()
  }

  useOutsideClick(modalRef as React.RefObject<HTMLElement>, handleClose)
  useKeyClose('Escape', modalRef as React.RefObject<HTMLElement>, handleClose)
  useScrollLock(isOpen)

  if (!isOpen) return null

  return (
    <S.Overlay>
      <S.ModalContainer ref={modalRef}>
        <S.ContentWrapper>
          <S.Title>{title}</S.Title>
          {isRegular && <S.Description>{description}</S.Description>}
        </S.ContentWrapper>

        <S.ButtonWrapper>
          <S.ConfirmButton onClick={handleClose}>확인</S.ConfirmButton>
        </S.ButtonWrapper>
      </S.ModalContainer>
    </S.Overlay>
  )
}
