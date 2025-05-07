'use client'
import { useState } from 'react'
import styled from '@emotion/styled'

import { ChallengeVerificationStatusType } from '@entities/challenge/type'
import VerificationImageInput from '@features/challenge/components/verification-image-input/VerificationImageInput'
import { theme } from '@shared/styles/theme'

const statuses: ChallengeVerificationStatusType[] = ['SUCCESS', 'FAILURE', 'PENDING_APPROVAL', 'NOT_SUBMITTED', 'DONE']

const MainPage = () => {
  const [status, setStatus] = useState<ChallengeVerificationStatusType>('NOT_SUBMITTED')
  const [imageUrl, setImageUrl] = useState<string | undefined>(undefined)

  const handleImageChange = (file: File | null) => {
    if (file) {
      const url = URL.createObjectURL(file)
      setImageUrl(url)
    } else {
      setImageUrl(undefined)
    }
  }

  return (
    <PageWrapper>
      123
      <Controls>
        {statuses.map(s => (
          <button
            key={s}
            onClick={() => setStatus(s)}
            style={{
              padding: '4px 8px',
              borderRadius: 4,
              backgroundColor: status === s ? theme.colors.lfGreenMain.base : theme.colors.lfLightGray.base,
              color: '#000',
              border: 'none',
              cursor: 'pointer',
            }}
          >
            {s}
          </button>
        ))}
      </Controls>
      <VerificationImageInput
        label={`인증샷 성공 예시\n이미지 추가`}
        description='성공 인증샷 설명'
        status={status}
        imageUrl={imageUrl}
        onChange={handleImageChange}
        onZoomClick={() => alert('확대 클릭됨')}
      />
    </PageWrapper>
  )
}
export default MainPage

const PageWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 24px;
  padding: 32px;
`

const Controls = styled.div`
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
  justify-content: center;
`
