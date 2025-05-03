'use client'
import { ReactNode } from 'react'
import styled from '@emotion/styled'

import ImageInput from '@shared/components/ImageInput'

interface ChallengePageProps {
  className?: string
}

const ChallengePage = ({ className }: ChallengePageProps): ReactNode => {
  return (
    <div className={className}>
      {/* 이건 반드시 하나만 렌더링되게 해야 함 */}
      <Overlay>
        <ImageInput />
      </Overlay>
    </div>
  )
}

export default ChallengePage

// === 스타일 ===
const Overlay = styled.div`
  height: 500px;

  display: flex;
  justify-content: center;
  align-items: center;
`
