import { ChallengeWarning } from './types'

export const CHALLENGE_DETAILS_WARNINGS: ChallengeWarning[] = [
  { isWarning: false, value: '단체 챌린지는 재참여가 불가능합니다.' },
  { isWarning: false, value: '인증 참여가 아닌, 성공시 나뭇잎이 부여됩니다.' },
  { isWarning: false, value: '인증 여부는 AI가 판단합니다.' },
  { isWarning: false, value: '인증 사진은 모든 사용자에게 공개됩니다.' },
  { isWarning: true, value: '부적절한 인증 사진은 관리자에 의해 삭제될 수 있습니다.' },
]
