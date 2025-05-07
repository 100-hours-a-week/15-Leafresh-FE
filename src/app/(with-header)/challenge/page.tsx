// src/app/page.tsx
'use client'

import { useState } from 'react'
import styled from '@emotion/styled'
import SwitchTap from '@shared/components/switchtap/SwitchTap'

export default function Page() {
  const [tab, setTab] = useState(0)

  return (
    <Wrapper>
      <SwitchTap tabs={['카메라', '인증 방법']} currentIndex={tab} onChange={setTab} />

      <ContentArea>
        {tab === 0 ? (
          <Placeholder>📷 카메라 화면을 여기에 렌더링</Placeholder>
        ) : (
          <Placeholder>🔐 인증 방법 설명을 여기에 렌더링</Placeholder>
        )}
      </ContentArea>
    </Wrapper>
  )
}

const Wrapper = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center; /* 가운데 정렬 */
  padding: 24px;
  gap: 24px; /* 컴포넌트 간 여백 */
`

const ContentArea = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  max-width: 480px; /* 반응형 최대 너비 */
  min-height: 240px; /* 기본 높이 */
  padding: 16px;
  border: 1px solid #eee;
  border-radius: 8px;
  background: #fafafa;
`

const Placeholder = styled.div`
  font-size: 1rem;
  color: #666;
`
