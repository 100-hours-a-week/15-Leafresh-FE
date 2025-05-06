'use client'
import { useConfirmModalStore } from '@shared/context/Modal/ConfirmModalStore'

const MainPage = () => {
  const { openConfirmModal } = useConfirmModalStore()

  return (
    <main>
      <div
        onClick={() =>
          openConfirmModal({
            title: '123',
            description: '123123123',
            onConfirm: () => alert('confirm'),
          })
        }
      >
        123
      </div>
    </main>
  )
}
export default MainPage
