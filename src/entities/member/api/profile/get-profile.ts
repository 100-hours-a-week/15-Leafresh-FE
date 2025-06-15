import { ENDPOINTS } from '@shared/constants/endpoint'
import { fetchRequest } from '@shared/lib/api/fetcher/fetcher'

export type ProfileResponse = {
  nickname: string
  profileImageUrl: string
  treeLevelId: number
  treeLevelName: string
  treeImageUrl: string
}

// GET /api/members/badges/recent
export const getMemberProfile = () => {
  return fetchRequest<ProfileResponse>(ENDPOINTS.MEMBERS.DETAILS)
}
