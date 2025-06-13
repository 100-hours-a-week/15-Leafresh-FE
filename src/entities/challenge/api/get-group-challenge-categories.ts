import { ChallengeCategoryType, ChallengeCategoryTypeKor } from '@entities/challenge/model/type'
import { ENDPOINTS } from '@shared/constants/endpoint/endpoint'
import { fetchRequest } from '@shared/lib/api'

export type GroupChallengeCategory = {
  category: ChallengeCategoryType
  label: ChallengeCategoryTypeKor
  imageUrl: string
}

type GroupChallengeCategoryListResponse = {
  categories: GroupChallengeCategory[]
}

export const getGroupChallengeCategoryList = () => {
  return fetchRequest<GroupChallengeCategoryListResponse>(ENDPOINTS.CHALLENGE.GROUP.CATEGORIES)
}
