import { ChallengeCategoryType, ChallengeVerificationResultType } from '@entities/challenge/type'
import { ENDPOINTS } from '@shared/constants/endpoint/endpoint'
import { fetchRequest } from '@shared/lib/api/fetcher/fetcher'
import { DateFormatString, TimeFormatString } from '@shared/types/date'

export type CreateChallengeResponse = {
  id: number
}

export type ExampleImage = {
  imageUrl: string
  type: ChallengeVerificationResultType
  description: string
  sequenceNumber: number
}

export type CreateChallengeBody = {
  title: string
  description: string
  category: ChallengeCategoryType
  maxParticipantCount: number
  thumbnailImageUrl: string
  startDate: DateFormatString
  endDate: DateFormatString
  verificationStartTime: TimeFormatString
  verificationEndTime: TimeFormatString
  exampleImages: ExampleImage[]
}

export type CreateChallengeVariables = {
  body: CreateChallengeBody
}

/**
 * 닉네임 중복 검사 API
 */
export const CreateChallenge = ({ body }: CreateChallengeVariables) => {
  return fetchRequest<CreateChallengeResponse>(ENDPOINTS.CHALLENGE.GROUP.CREATE, {
    body,
  })
}
