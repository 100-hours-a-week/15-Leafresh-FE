// @features/challenge/api/getPersonalChallengeList.ts

import { DayType } from '@entities/challenge/type'
import { ENDPOINTS } from '@shared/constants/endpoint/endpoint'
import { ApiResponse, fetchRequest } from '@shared/lib/api/fetcher/fetcher'

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

type GetPersonalChallengeListResponse = ApiResponse<{
  personalChallenges: PersonalChallengeType[]
}>

export const getPersonalChallengeList = (
  query: GetPersonalChallengeListQuery,
): Promise<GetPersonalChallengeListResponse> => {
  return fetchRequest<GetPersonalChallengeListResponse>(ENDPOINTS.CHALLENGE.PERSONAL.LIST, {
    query,
  })
}
