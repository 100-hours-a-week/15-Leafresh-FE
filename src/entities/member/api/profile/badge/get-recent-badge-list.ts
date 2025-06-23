import { ENDPOINTS, fetchRequest } from '@/shared/lib'

//뱃지 타입
export type RecentBadge = {
  id: number
  name: string
  condition: string
  imageUrl: string
}

export interface RecentBadgesResponse {
  badges: RecentBadge[]
}

type RecentBadgesQuery = {
  count: number
}

// GET /api/members/badges/recent
export const getRecentBadges = (query: RecentBadgesQuery) => {
  return fetchRequest<RecentBadgesResponse>(ENDPOINTS.MEMBERS.BADGES.RECENT, {
    query,
  })
}
