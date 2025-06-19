import { ENDPOINTS } from '@shared/constants/endpoint/endpoint'
import { fetchRequest } from '@shared/lib/api/fetcher/fetcher'

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
