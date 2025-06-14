export interface Badge {
  id: number
  name: string
  imageUrl: string
}

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
  badges: Badge[]
}

export interface ProfileCardProps {
  data: ProfileCardData
  onDismiss?: () => void
}
