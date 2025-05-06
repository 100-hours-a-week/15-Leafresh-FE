'use client'

import { useRef } from 'react'
import styled from '@emotion/styled'
import { theme } from '@shared/styles/emotion/theme'

import { useOutsideClick } from '@shared/hooks/useOutsideClick/useOutsideClick'
import { useKeyClose } from '@shared/hooks/useKeyClose/useKeyClose'
import { useScrollLock } from '@shared/hooks/useScrollLock/useScrollLock'

import { useInfoModalStore, InfoModalVariant } from '@shared/context/Modal/InfoModalStore'

const InfoModal = () => {
  const {
    isOpen,
    title,
    description,
    variant,
    onClose,
    closeInfoModal,
  } = useInfoModalStore()

  const modalRef = useRef<HTMLDivElement>(null)
  const isRegualr = description && variant !== 'minimal'

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
      <ModalContainer ref={modalRef}>
        <ContentWrapper>
            <Title>{title}</Title>
            {isRegualr && <Description>{description}</Description>}
        </ContentWrapper>

        <ButtonWrapper>
          <ConfirmButton onClick={handleClose}>
            확인
          </ConfirmButton>
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

const ModalContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  background-color: ${theme.colors.lfWhite.base};
  border-radius: ${theme.radius.base};
  width: 278px;
  min-height: 110px;
`

const ContentWrapper = styled.div`
    padding: 15px 17px 0;
    flex-grow: 1;
`

const Title = styled.h2`
  margin: 0;
  font-size: ${theme.fontSize.base};
  font-weight: ${theme.fontWeight.medium};
  color: ${theme.colors.lfBlack.base};
`

const Description = styled.p`
  margin: 15px 0 0;
  font-size: ${theme.fontSize.xs};
  color: ${theme.colors.lfDarkGray.base};
  font-weight: ${theme.fontWeight.regular};
`
//확인 버튼은 다른 padding값을 받기 때문에 Wrapper를 나누어 관리, 또한 항상 가장 하단에 위치
const ButtonWrapper = styled.div`
  display: flex;
  justify-content: flex-end;
  margin-top: 0px;
  padding: 0 4px 11px;
`

const ConfirmButton = styled.button`
  cursor: pointer;
  background: none;
  border: none;
  color: ${theme.colors.lfBlue.base};
  font-size: ${theme.fontSize.sm};
  font-weight: ${theme.fontWeight.medium};
  padding: 9.5px 14.5px;
`

const CancelButton = styled.button`
  background: none;
  border: none;
  color: ${theme.colors.lfGray.base};
  font-size: ${theme.fontSize.sm};
  cursor: pointer;
`
