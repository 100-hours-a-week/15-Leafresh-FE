import { ENDPOINTS, fetchRequest } from '@/shared/lib'

import { FilterChallengeCategoryType, FilterChallengeCategoryTypeKor } from '../../model'

export type GroupChallengeCategory = {
  category: FilterChallengeCategoryType
  label: FilterChallengeCategoryTypeKor
  imageUrl: string
}

type GroupChallengeCategoryListResponse = {
  categories: GroupChallengeCategory[]
}

export const getGroupChallengeCategoryList = async () => {
  const response = await fetchRequest<GroupChallengeCategoryListResponse>(ENDPOINTS.CHALLENGE.GROUP.CATEGORIES)

  const sortedCategories = [...response.data.categories].sort((a, b) => {
    if (a.label === '전체') return -1
    if (b.label === '전체') return 1
    return 0
  })

  return {
    ...response,
    data: {
      ...response.data,
      categories: sortedCategories,
    },
  }
}
