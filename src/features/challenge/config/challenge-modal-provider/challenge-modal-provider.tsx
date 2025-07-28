'use client'

import { useEffect } from 'react'

import { CameraModal, ImageZoomModal } from '@/features/challenge/components/modal'

import { useCameraModalStore, useImageZoomStore } from '@/shared/context'

export const ChallengeModalProvider = () => {
  const { isOpen: isCameraOpen, close: closeCameraModal } = useCameraModalStore()
  const { isOpen: isImageModalOpen, close: closeImageModal } = useImageZoomStore()

  /** 뒤로가기(popstate) 시 모든 모달 닫기 */
  useEffect(() => {
    const handlePopState = () => {
      if (isCameraOpen) closeCameraModal()
      if (isImageModalOpen) closeImageModal()
    }

    window.addEventListener('popstate', handlePopState)
    return () => window.removeEventListener('popstate', handlePopState)
  }, [isCameraOpen, isImageModalOpen])

  return (
    <>
      <CameraModal />
      <ImageZoomModal />
    </>
  )
}
