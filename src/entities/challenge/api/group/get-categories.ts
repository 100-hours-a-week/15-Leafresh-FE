import { FilterChallengeCategoryType, FilterChallengeCategoryTypeKor } from '../../model'

import { ENDPOINTS, fetchRequest } from '@/shared/lib'

export type GroupChallengeCategory = {
  category: FilterChallengeCategoryType
  label: FilterChallengeCategoryTypeKor
  imageUrl: string
}

type GroupChallengeCategoryListResponse = {
  categories: GroupChallengeCategory[]
}

export const getGroupChallengeCategoryList = () => {
  return fetchRequest<GroupChallengeCategoryListResponse>(ENDPOINTS.CHALLENGE.GROUP.CATEGORIES)
}
