import { ChallengeCategoryType, ChallengeCategoryTypeKor } from '@entities/challenge/type'
import { ENDPOINTS } from '@shared/constants/endpoint/endpoint'
import { ApiResponse, fetchRequest } from '@shared/lib/api/fetcher/fetcher'

export type GroupChallengeCategory = {
  category: ChallengeCategoryType
  label: ChallengeCategoryTypeKor
  imageUrl: string
}

type GroupChallengeCategoryListResponse = ApiResponse<{
  categories: GroupChallengeCategory[]
}>

export const getGroupChallengeCategoryList = (): Promise<GroupChallengeCategoryListResponse> => {
  return fetchRequest<GroupChallengeCategoryListResponse>(ENDPOINTS.CHALLENGE.GROUP.CATEGORIES)
}
