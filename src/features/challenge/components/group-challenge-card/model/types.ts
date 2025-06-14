import { ChallengeCategoryType } from '@entities/challenge/model'
import { DateFormatString } from '@shared/types/date'

export type GroupChallenge = {
  id: number
  name: string
  description: string
  startDate: DateFormatString // YYYY-mm-dd
  endDate: DateFormatString
  imageUrl: string
  currentParticipantCount: number
  category: ChallengeCategoryType

  leafReward?: number // 생성한 챌린지에는 없음
}

export interface GroupChallengeCardProps {
  data: GroupChallenge

  isAuth: boolean // 본인의 챌린지인지 여부

  deleteCallback?: () => void // 삭제 후 실행 콜백

  className?: string
}
