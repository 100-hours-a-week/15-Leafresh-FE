import { ApiResponse, fetchRequest } from '@shared/lib/api/fetcher/fetcher'
import { HttpMethod } from '@shared/constants/http'
import { ENDPOINTS } from '@shared/constants/endpoint/endpoint'

export interface ProfileCardData {
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

export interface CardBadge {
  id: number
  name: string
  imageUrl: string
}

// GET /api/members/profilecard
export const getMemberProfileCard = () => {
  return fetchRequest<ProfileCardData>(ENDPOINTS.MEMBERS.PROFILE_CARD)
}
