// @features/challenge/api/getGroupChallengeCategoryList.ts

import { ChallengeCategoryType, ChallengeCategoryTypeKor } from '@entities/challenge/type'
import { ENDPOINTS } from '@shared/constants/endpoint/endpoint'
import { ApiResponse, fetchRequest } from '@shared/lib/api/fetcher/fetcher'

export type GroupChallengeCategory = {
  category: ChallengeCategoryType
  label: ChallengeCategoryTypeKor
  imageUrl: string
}

type GetGroupChallengeCategoryListResponse = ApiResponse<{
  categories: GroupChallengeCategory[]
}>

export const getGroupChallengeCategoryList = (): Promise<GetGroupChallengeCategoryListResponse> => {
  return fetchRequest<GetGroupChallengeCategoryListResponse>(ENDPOINTS.CHALLENGE.GROUP.CATEGORIES)
}
