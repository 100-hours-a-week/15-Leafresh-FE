import { ENDPOINTS } from '@shared/constants/endpoint/endpoint'
import { ApiResponse, fetchRequest } from '@shared/lib/api/fetcher/fetcher'
import { ISOFormatString } from '@shared/types/date'

export interface GroupChallengeParticipateListParams {
  challengeId: number
  cursorId?: number
  cursorTimestamp?: ISOFormatString
}

type VerificationType = {
  id: number
  nickname: string
  profileImageUrl: string
  verificationImageUrl: string
  description: string
}

export type GroupChallengeParticipateList = {
  verifications: VerificationType[]
  hasNext: boolean
  cursorInfo: {
    lastCursorId: number
    cursorTimestamp: ISOFormatString
  }
}

type GetGroupChallengeParticipateListResponse = ApiResponse<GroupChallengeParticipateList>

export const getGroupChallengeParticipateList = ({
  challengeId,
  cursorId,
  cursorTimestamp,
}: GroupChallengeParticipateListParams): Promise<GetGroupChallengeParticipateListResponse> => {
  return fetchRequest<GetGroupChallengeParticipateListResponse>(ENDPOINTS.CHALLENGE.GROUP.VERIFICATIONS(challengeId), {
    query: {
      ...(cursorId !== undefined ? { cursorId } : {}),
      ...(cursorTimestamp ? { cursorTimestamp } : {}),
    },
  })
}
