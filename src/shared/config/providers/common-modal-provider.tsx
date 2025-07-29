'use client'

import { useEffect } from 'react'

import { ConfirmModal, InfoModal } from '@/shared/components'
import { useConfirmModalStore, useInfoModalStore } from '@/shared/context'

export const CommonModalProvider = () => {
  const { isOpen: isConfirmOpen, closeConfirmModal } = useConfirmModalStore()
  const { isOpen: isInfoOpen, closeInfoModal } = useInfoModalStore()

  /** 뒤로가기(popstate) 시 모든 모달 닫기 */
  useEffect(() => {
    const handlePopState = () => {
      if (isConfirmOpen) closeConfirmModal()
      if (isInfoOpen) closeInfoModal()
    }

    window.addEventListener('popstate', handlePopState)
    return () => window.removeEventListener('popstate', handlePopState)
  }, [isConfirmOpen, isInfoOpen])

  return (
    <>
      <ConfirmModal />
      <InfoModal />
    </>
  )
}
