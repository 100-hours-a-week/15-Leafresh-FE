import { ChallengeCategoryType, ChallengeVerificationResultType } from '@entities/challenge/type'
import { ENDPOINTS } from '@shared/constants/endpoint/endpoint'
import { ApiResponse, fetchRequest } from '@shared/lib/api/fetcher/fetcher'
import { DateFormatString, TimeFormatString } from '@shared/types/date'

// TODO : isDuplicated -> isAvailable 로 변수명 저정
/**
 * false: 사용 가능 / true 사용 불가능
 */
export type CreateChallengeResponse = ApiResponse<{
  id: number
}>

export type ExampleImageType = {
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
  exampleImages: ExampleImageType[]
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
