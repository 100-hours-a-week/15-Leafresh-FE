import { LucideIconProps } from '@shared/lib/ui/LucideIcon'
import { ThemeColorType } from '@shared/styles/theme/type'

export type VerificationStatus = 'SUCCESS' | 'FAILURE' | 'PENDING_APPROVAL'

export interface StatusConfig {
  barColor: string // 헥스코드: styled BottomBar 에 쓰임
  iconName: LucideIconProps['name']
  iconColorKey: ThemeColorType
}

export interface VerificationStatusCardProps {
  day: number
  imageUrl: string
  status: VerificationStatus
}
