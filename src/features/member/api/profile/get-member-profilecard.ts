import { fetchRequest } from '@shared/lib/api/fetcher/fetcher'
import { HttpMethod } from '@shared/constants/http'
import { ENDPOINTS } from '@shared/constants/endpoint/endpoint'

export interface CardBadge {
  id: number
  name: string
  imageUrl: string
}
export interface ProfileCardResponse {
  nickname: string
  profileImageUrl: string
  treeLevelId: number
  treeLevelName: string
  treeImageUrl: string
  nextTreeLevelName: string
  nextTreeImageUrl: string
  totalLeafPoints: number
  leafPointsToNextLevel: number
  totalSuccessfulVerifications: number
  completedGroupChallengesCount: number
  badges: CardBadge[]
}

// GET /api/members/profilecard
export const getMemberProfileCard = () => {
  return fetchRequest<ProfileCardResponse>(ENDPOINTS.MEMBERS.PROFILE_CARD)
}
