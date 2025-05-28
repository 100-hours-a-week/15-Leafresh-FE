import { fetchRequest } from '@shared/lib/api/fetcher/fetcher'
import { ENDPOINTS } from '@shared/constants/endpoint/endpoint'

//뱃지 타입
export interface Badge {
  id: number
  name: string
  condition: string
  imageUrl: string
}

export interface RecentBadgesData {
  badges: Badge[]
}

type RecentBadgesQuery = {
  count: number
}

// GET /api/members/badges/recent
export const getRecentBadges = (query: RecentBadgesQuery) => {
  return fetchRequest<RecentBadgesData>(ENDPOINTS.MEMBERS.RECENT_BADGES, {
    query,
  })
}
