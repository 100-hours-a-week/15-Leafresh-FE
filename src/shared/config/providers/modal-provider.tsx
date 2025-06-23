'use client'

import { useEffect } from 'react'

import { CameraModal, ConfirmModal, ImageZoomModal, InfoModal } from '@/shared/components'
import { useCameraModalStore, useConfirmModalStore, useImageZoomStore, useInfoModalStore } from '@/shared/context'

export const ModalProvider = () => {
  const { isOpen: isCameraOpen, close: closeCameraModal } = useCameraModalStore()
  const { isOpen: isConfirmOpen, closeConfirmModal } = useConfirmModalStore()
  const { isOpen: isInfoOpen, closeInfoModal } = useInfoModalStore()
  const { isOpen: isImageModalOpen, close: closeImageModal } = useImageZoomStore()

  /** 뒤로가기(popstate) 시 모든 모달 닫기 */
  useEffect(() => {
    const handlePopState = () => {
      if (isCameraOpen) closeCameraModal()
      if (isConfirmOpen) closeConfirmModal()
      if (isInfoOpen) closeInfoModal()
      if (isImageModalOpen) closeImageModal()
    }

    window.addEventListener('popstate', handlePopState)
    return () => window.removeEventListener('popstate', handlePopState)
  }, [isCameraOpen, isConfirmOpen, isInfoOpen, isImageModalOpen])

  return (
    <>
      <ConfirmModal />
      <CameraModal />
      <InfoModal />
      <ImageZoomModal />
    </>
  )
}
