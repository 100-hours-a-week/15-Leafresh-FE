import { DayType } from '@entities/common/type'
import { ENDPOINTS } from '@shared/constants/endpoint/endpoint'
import { fetchRequest } from '@shared/lib/api'

type GetPersonalChallengeListQuery = {
  dayOfWeek: DayType
}

export type PersonalChallengeType = {
  id: number
  title: string
  description: string
  thumbnailUrl: string
  leafReward: number
}

type GetPersonalChallengeListResponse = {
  personalChallenges: PersonalChallengeType[]
}

export const getPersonalChallengeList = (query: GetPersonalChallengeListQuery) => {
  return fetchRequest<GetPersonalChallengeListResponse>(ENDPOINTS.CHALLENGE.PERSONAL.LIST, {
    query,
  })
}
