// @features/challenge/api/getGroupChallengeDetails.ts

import { ChallengeVerificationResultType, ChallengeVerificationStatusType, DayType } from '@entities/challenge/type'
import { ENDPOINTS } from '@shared/constants/endpoint/endpoint'
import { serverFetchRequest } from '@shared/lib/api/fetcher'
import { fetchRequest } from '@shared/lib/api/fetcher/fetcher'
import { TimeFormatString } from '@shared/types/date'

export type PersonalChallengeDetail = {
  id: number
  title: string
  description: string
  thumbnailUrl: string
  dayOfWeek: DayType
  verificationStartTime: TimeFormatString
  verificationEndTime: TimeFormatString
  leafReward: number
  exampleImages: {
    id: number
    imageUrl: string
    type: ChallengeVerificationResultType
    description: string
    sequenceNumber: number
  }[]
  status: ChallengeVerificationStatusType
}

type PersonalChallengeDetailResponse = PersonalChallengeDetail

export const getPersonalChallengeDetails = (id: number) => {
  return fetchRequest<PersonalChallengeDetailResponse>(ENDPOINTS.CHALLENGE.PERSONAL.DETAILS(id))
}

export const getServerPersonalChallengeDetails = (id: number) => {
  return serverFetchRequest<PersonalChallengeDetailResponse>(ENDPOINTS.CHALLENGE.PERSONAL.DETAILS(id))
}
