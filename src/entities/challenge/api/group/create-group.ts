import { ENDPOINTS, fetchRequest } from '@/shared/lib'
import { ISOFormatString, TimeFormatString } from '@/shared/type'

import { ChallengeCategoryType, ChallengeVerificationResultType } from '../../model'

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
  startDate: ISOFormatString
  endDate: ISOFormatString
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
