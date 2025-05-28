import { fetchRequest } from '@shared/lib/api/fetcher/fetcher'
import { HttpMethod } from '@shared/constants/http'
import { ENDPOINTS } from '@shared/constants/endpoint/endpoint'

export interface Profile {
  nickname: string
  profileImageUrl: string
  treeLevelId: number
  treeLevelName: string
  treeImageUrl: string
}

// GET /api/members/badges/recent
export const getMemberProfile = () => {
  return fetchRequest<Profile>(ENDPOINTS.MEMBERS.DETAILS)
}
