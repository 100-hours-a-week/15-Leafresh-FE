import { ChallengeType } from '@/entities/challenge/model'

import { ENDPOINTS, fetchRequest } from '@/shared/lib'
import { InfiniteScrollResponse, ISOFormatString } from '@/shared/type'

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

export type MemberAlarmList = InfiniteScrollResponse<{
  notifications: AlarmType[]
}>

type GetMemberAlarmListResponse = MemberAlarmList

export const getMemberAlarmList = ({ cursorId, cursorTimestamp }: MemberAlarmListParams) => {
  return fetchRequest<GetMemberAlarmListResponse>(ENDPOINTS.MEMBERS.NOTIFICATION.LIST, {
    query: {
      ...(cursorId !== undefined ? { cursorId } : {}),
      ...(cursorTimestamp ? { cursorTimestamp } : {}),
    },
  })
}
