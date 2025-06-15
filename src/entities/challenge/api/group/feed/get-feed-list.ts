import { ChallengeCategoryType } from '@entities/challenge/model'
import { ENDPOINTS } from '@shared/constants/endpoint'
import { fetchRequest } from '@shared/lib/api/fetcher/fetcher'
import { InfiniteScrollResponse } from '@shared/type/api'
import { ISOFormatString } from '@shared/type/date'

export interface GroupChallengeFeedListParams {
  cursorId?: number
  cursorTimestamp?: ISOFormatString
  category?: ChallengeCategoryType // 없는 경우 : "전체" 카테고리인 경우
}

export type VerificationData = {
  id: number
  challengeId: number
  nickname: string
  profileImageUrl: string
  verificationImageUrl: string
  description: string
  category: ChallengeCategoryType
  counts: {
    view: number
    like: number
    comment: number
  }
  createdAt: ISOFormatString
  isLiked: boolean
}

export type GroupChallengeFeedList = InfiniteScrollResponse<{
  verifications: VerificationData[]
}>

type GetGroupChallengeFeedListResponse = GroupChallengeFeedList

export const getGroupChallengeFeedList = ({ category, cursorId, cursorTimestamp }: GroupChallengeFeedListParams) => {
  return fetchRequest<GetGroupChallengeFeedListResponse>(ENDPOINTS.CHALLENGE.GROUP.FEED, {
    query: {
      ...(category ? { category } : {}), // "전체" 인 경우에는 카테고리 쿼리 없이 요청
      ...(cursorId !== undefined ? { cursorId } : {}),
      ...(cursorTimestamp ? { cursorTimestamp } : {}),
    },
  })
}
