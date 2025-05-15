import { ChallengeType } from '@entities/challenge/type'
import { ENDPOINTS } from '@shared/constants/endpoint/endpoint'
import { ApiResponse, fetchRequest } from '@shared/lib/api/fetcher/fetcher'
import { ISOFormatString } from '@shared/types/date'

export interface MemberAlarmListParams {
  cursorId?: number
  cursorTimestamp?: ISOFormatString
}

export type AlarmType = {
  id: number // 알람 아이디
  title: string
  content: string
  createdAt: ISOFormatString
  isRead: boolean
  type: ChallengeType
  imageUrl: string
  challengeId: number
}

export type MemberAlarmList = {
  notifications: AlarmType[]
  hasNext: boolean
  cursorInfo: {
    lastCursorId: number
    cursorTimestamp: ISOFormatString
  }
}

type GetMemberAlarmListResponse = ApiResponse<MemberAlarmList>

export const getMemberAlarmList = ({
  cursorId,
  cursorTimestamp,
}: MemberAlarmListParams): Promise<GetMemberAlarmListResponse> => {
  return fetchRequest<GetMemberAlarmListResponse>(ENDPOINTS.MEMBERS.NOTIFICATION.LIST, {
    query: {
      ...(cursorId !== undefined ? { cursorId } : {}),
      ...(cursorTimestamp ? { cursorTimestamp } : {}),
    },
  })
}
