import { ReactNode } from 'react'
import styled from '@emotion/styled'

interface ListProps {
  className?: string
  children: ReactNode
}

const GroupChallengeParticipantCardList = ({ className, children }: ListProps): ReactNode => {
  return <ListWrapper className={className}>{children}</ListWrapper>
}

export default GroupChallengeParticipantCardList

const ListWrapper = styled.div`
  flex: 1;
  min-height: 0;
  display: block;
  flex-direction: column;
  gap: 16px;
  overflow-y: auto; /* 내부 스크롤 활성화 */
  padding-right: 8px;
  padding-bottom: 20px;
  > * {
    margin-bottom: 16px;
  }

  /* 마지막 자식 요소의 마진 제거 (선택사항) */
  > *:last-child {
    margin-bottom: 0;
  }
`
