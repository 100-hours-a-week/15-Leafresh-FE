import { ENDPOINTS, fetchRequest } from '@/shared/lib'
import { InfiniteScrollResponse, ISOFormatString } from '@/shared/type'

import { ChallengeType } from '../../model'

export interface ChallengeAlarmListParams {
  cursorId?: number
  cursorTimestamp?: ISOFormatString
}

export type AlarmType<T> = {
  id: number // 알람 아이디
  title: string
  content: string
  createdAt: ISOFormatString
  isRead: boolean
  type: T
  imageUrl: string
  challengeId: number
}

export type ChallengeAlarmType = AlarmType<ChallengeType>

export type ChallengeAlarmList = InfiniteScrollResponse<{
  notifications: ChallengeAlarmType[]
}>

export const getChallengeAlarmList = ({ cursorId, cursorTimestamp }: ChallengeAlarmListParams) => {
  return fetchRequest<ChallengeAlarmList>(ENDPOINTS.MEMBERS.NOTIFICATION.LIST, {
    query: {
      ...(cursorId !== undefined ? { cursorId } : {}),
      ...(cursorTimestamp ? { cursorTimestamp } : {}),
    },
  })
}
