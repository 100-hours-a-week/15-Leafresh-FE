import { ENDPOINTS } from '@shared/constants/endpoint/endpoint'
import { fetchRequest } from '@shared/lib/api/fetcher/fetcher'

export type Badge = {
  id: number
  name: string
  condition: string
  imageUrl: string
  isLocked: boolean
}

export type BadgeData = Record<string, Badge[]>

export interface BadgeListResponse {
  badges: BadgeData
}

// GET /api/members/badges
export const getBadgeList = () => {
  return fetchRequest<BadgeListResponse>(ENDPOINTS.MEMBERS.BADGES.LIST)
}
