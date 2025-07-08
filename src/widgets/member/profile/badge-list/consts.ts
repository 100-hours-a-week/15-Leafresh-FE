import { BadgeData } from '@/entities/member/api'

export const fallbackData: BadgeData = {
  group: Array.from({ length: 2 }, (_, i) => ({
    id: i,
    name: `그룹 뱃지 ${i + 1}`,
    condition: `플로깅 챌린지 ${i + 1}회 인증`,
    imageUrl: 'https://storage.googleapis.com/leafresh-images/example2.png',
    isLocked: i % 2 === 0,
  })),
  personal: Array.from({ length: 10 }, (_, i) => ({
    id: i + 10,
    name: `개인 뱃지 ${i + 1}`,
    condition: `개인 챌린지 ${i + 1}일 연속 인증`,
    imageUrl: 'https://storage.googleapis.com/leafresh-images/example2.png',
    isLocked: i % 2 !== 0,
  })),
  total: [
    {
      id: 20,
      name: '그린 마스터',
      condition: '누적 100회 챌린지 인증',
      imageUrl: 'https://storage.googleapis.com/leafresh-images/example2.png',
      isLocked: true,
    },
  ],
  special: [
    {
      id: 30,
      name: '지속가능 전도사',
      condition: '모든 카테고리 챌린지 1회 이상 인증',
      imageUrl: 'https://storage.googleapis.com/leafresh-images/example2.png',
      isLocked: false,
    },
  ],
  event: [
    {
      id: 40,
      name: '물수호대',
      condition: '물 절약 캠페인 인증 3회',
      imageUrl: 'https://storage.googleapis.com/leafresh-images/example2.png',
      isLocked: true,
    },
  ],
}
