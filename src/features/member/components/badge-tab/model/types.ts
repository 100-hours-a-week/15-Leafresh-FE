import { BadgeData } from '@entities/member/api'
import { Category } from '@entities/member/model'

export interface BadgeTabProps {
  categories: Category[]
  badgeData: BadgeData
}
