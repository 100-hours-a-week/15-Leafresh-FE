import { fetchRequest } from '@shared/lib/api/fetcher/fetcher'
import { ENDPOINTS } from '@shared/constants/endpoint/endpoint'

//뱃지 타입
export type Badge = {
  id: number
  name: string
  condition: string
  imageUrl: string
}

export interface RecentBadgesResponse {
  badges: Badge[]
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
