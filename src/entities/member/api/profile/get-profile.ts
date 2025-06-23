import { ENDPOINTS, fetchRequest } from '@/shared/lib'

export type ProfileResponse = {
  nickname: string
  email: string
  profileImageUrl: string
  treeLevelId: number
  treeLevelName: string
  treeImageUrl: string
}

// GET /api/members/badges/recent
export const getMemberProfile = () => {
  return fetchRequest<ProfileResponse>(ENDPOINTS.MEMBERS.DETAILS)
}
