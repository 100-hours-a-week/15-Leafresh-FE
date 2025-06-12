import { ChallengeCategoryType, ChallengeCategoryTypeKor } from '@entities/challenge/type'
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
  console.log(ENDPOINTS.CHALLENGE.GROUP.CATEGORIES)
  return fetchRequest<GroupChallengeCategoryListResponse>(ENDPOINTS.CHALLENGE.GROUP.CATEGORIES)
}
