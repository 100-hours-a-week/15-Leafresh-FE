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
  margin-top: 10px;
  flex: 1;

  flex-direction: column;
  gap: 16px;
  overflow-y: auto; /* 내부 스크롤 활성화 */
`
