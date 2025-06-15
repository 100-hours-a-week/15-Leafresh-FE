'use client'

import { useEffect } from 'react'

import { useCameraModalStore } from '@shared/context/modal/CameraModalStore'
import { useConfirmModalStore } from '@shared/context/modal/ConfirmModalStore'
import { useInfoModalStore } from '@shared/context/modal/InfoModalStore'
import { useImageZoomStore } from '@shared/context/zoom-modal/ImageZoomStore'

import CameraModal from '../../components/modal/camera-modal/ui/camera-modal'
import ConfirmModal from '../../components/modal/confirm-modal/ui/confirm-modal'
import ImageZoomModal from '../../components/modal/image-zoom-modal/ui/image-zoom-modal'
import InfoModal from '../../components/modal/info-modal/ui/info-modal'

const ModalProvider = () => {
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

export default ModalProvider
