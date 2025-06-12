import { FilterChallengeCategoryType, FilterChallengeCategoryTypeKor } from '@entities/challenge/type'
import { ENDPOINTS } from '@shared/constants/endpoint/endpoint'
import { fetchRequest } from '@shared/lib/api'

export type GroupChallengeCategory = {
  category: FilterChallengeCategoryType
  label: FilterChallengeCategoryTypeKor
  imageUrl: string
}

type GroupChallengeCategoryListResponse = {
  categories: GroupChallengeCategory[]
}

export const getGroupChallengeCategoryList = () => {
  console.log('entered getGroupChallengeCategoryList ')

  console.log('endpoint:', ENDPOINTS.CHALLENGE.GROUP.CATEGORIES)
  return fetchRequest<GroupChallengeCategoryListResponse>(ENDPOINTS.CHALLENGE.GROUP.CATEGORIES)
}
