import { Category } from '@entities/member'
import { BadgeData } from '@entities/member/api'

export interface BadgeTabProps {
  categories: Category[]
  badgeData: BadgeData
}
