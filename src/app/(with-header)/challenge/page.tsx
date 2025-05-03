'use client'
import { ReactNode } from 'react'
import styled from '@emotion/styled'

import { useConfirmModalStore } from '@shared/context/Modal/ConfirmModalStore'
import LucideIcon from '@shared/lib/ui/LucideIcon'

interface ChallengePageProps {
  className?: string
}

const ChallengePage = ({ className }: ChallengePageProps): ReactNode => {
  const { openConfirmModal } = useConfirmModalStore()

  const deleteHandler = () => {
    openConfirmModal({
      title: '정말 삭제하시겠습니까?정말 삭제하시겠습니까?정말 삭제하시겠습니까?정말 삭제하시겠습니까?',
      description: '삭제 후에는 복구할 수 없습니다.\n삭제 후에는 복구할 수 없습니다.삭제 후에는 복구할 수 없습니다.',
      onConfirm: () => {
        alert('삭제되었습니다')
      },
    })
  }
  return (
    <div className={className}>
      {/* 이건 반드시 하나만 렌더링되게 해야 함 */}
      <Overlay>
        <button onClick={deleteHandler}>삭제</button>
        <LucideIcon name='X' size={100} />
        {/* <X size={100} color={theme.colors.lfBlack.base} /> */}
      </Overlay>
    </div>
  )
}

export default ChallengePage

// === 스타일 ===
const Overlay = styled.div`
  height: 2000px;

  display: flex;
  justify-content: center;
  align-items: center;
`
