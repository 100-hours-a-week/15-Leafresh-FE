import { fetchRequest } from '@shared/lib/api/fetcher/fetcher'
import { ENDPOINTS } from '@shared/constants/endpoint/endpoint'

export interface ProfileResponse {
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
