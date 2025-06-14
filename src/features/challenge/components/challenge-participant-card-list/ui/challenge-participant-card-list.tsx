import { ReactNode } from 'react'

import { ListProps } from '../model/types'
import * as S from './styles'

const GroupChallengeParticipantCardList = ({ className, children }: ListProps): ReactNode => {
  return <S.ListWrapper className={className}>{children}</S.ListWrapper>
}

export default GroupChallengeParticipantCardList
