import { ReactNode } from 'react'

import * as S from './styles'

interface ListProps {
  className?: string
  children: ReactNode
}

export const GroupChallengeParticipantCardList = ({ className, children }: ListProps): ReactNode => {
  return <S.ListWrapper className={className}>{children}</S.ListWrapper>
}
