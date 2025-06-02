'use client'

import { ReactNode } from 'react'
import styled from '@emotion/styled'
import { useQuery } from '@tanstack/react-query'

import { DayType } from '@entities/challenge/type'
import { EventChallenge, getEventChallengeList } from '@features/challenge/api/get-event-challenge-list'
import {
  getGroupChallengeCategoryList,
  GroupChallengeCategory,
} from '@features/challenge/api/get-group-challenge-categories'
import { getPersonalChallengeList, PersonalChallengeType } from '@features/challenge/api/get-personal-challenge-list'
import { EventSection, GroupChallengeSections, PersonalChallengeSection } from '@features/main/components'
import Chatbot from '@shared/components/chatbot/Chatbot'
import { QUERY_OPTIONS } from '@shared/config/tanstack-query/query-defaults'
import { QUERY_KEYS } from '@shared/config/tanstack-query/query-keys'
import { getDayOfWeek } from '@shared/lib/date/utils'
import { responsiveHorizontalPadding } from '@shared/styles/ResponsiveStyle'

const MainPage = (): ReactNode => {
  const dayOfWeek: DayType = getDayOfWeek(new Date()) // 클라이언트 기준

  const { data: categoriesData } = useQuery({
    queryKey: QUERY_KEYS.CHALLENGE.GROUP.CATEGORIES,
    queryFn: getGroupChallengeCategoryList,
    ...QUERY_OPTIONS.CHALLENGE.GROUP.CATEGORIES,
  })

  const { data: eventData } = useQuery({
    queryKey: QUERY_KEYS.CHALLENGE.EVENT.LIST,
    queryFn: getEventChallengeList,
    ...QUERY_OPTIONS.CHALLENGE.EVENT.LIST,
  })

  const { data: personalData } = useQuery({
    queryKey: QUERY_KEYS.CHALLENGE.PERSONAL.LIST(dayOfWeek),
    queryFn: () => getPersonalChallengeList({ dayOfWeek }),
    ...QUERY_OPTIONS.CHALLENGE.PERSONAL.LIST,
  })

  const categories: GroupChallengeCategory[] = categoriesData?.data?.categories ?? []
  const eventChallenges: EventChallenge[] = eventData?.data.eventChallenges ?? []
  const personalChallenges: PersonalChallengeType[] = personalData?.data.personalChallenges ?? []

  return (
    <Container>
      <EventSection eventChallenges={eventChallenges} />
      <PersonalChallengeSection personalChallenges={personalChallenges} />
      <GroupChallengeSections categories={categories} />
      <Chatbot />
    </Container>
  )
}

export default MainPage

// === Styles ===

const Container = styled.div`
  ${responsiveHorizontalPadding};

  padding-bottom: 80px;

  display: flex;
  flex-direction: column;
  gap: 54px;
`

// const dummyEventChallenges: EventChallenge[] = [
//   {
//     id: 1,
//     title: '[1.환경의날]',
//     description: '이벤트이벤트이벤트\n이벤트이벤트이벤트\n이벤트이벤트이벤트',
//     imageUrl: '/icon/category_zero_waste.png',
//   },
//   {
//     id: 2,
//     title: '[2.에너지 절약]',
//     description: '조명을 꺼요\n절약해요\n함께해요',
//     imageUrl: '/icon/category_zero_waste.png',
//   },
//   {
//     id: 3,
//     title: '[3.에너지 절약]',
//     description: '조명을 꺼요\n절약해요\n함께해요',
//     imageUrl: '/icon/category_zero_waste.png',
//   },
//   {
//     id: 4,
//     title: '[4.에너지 절약]',
//     description: '조명을 꺼요\n절약해요\n함께해요',
//     imageUrl: '/icon/category_zero_waste.png',
//   },
// ]

// const dummyPersonalChallenges: PersonalChallengeType[] = [
//   {
//     id: 1,
//     title: '챌린지 제목',
//     description: '챌린지 설명',
//     imageUrl: '/icon/category_zero_waste.png',
//     leafReward: 400,
//   },
//   {
//     id: 2,
//     title: '챌린지 제목',
//     description: '챌린지 설명',
//     imageUrl: '/icon/category_zero_waste.png',
//     leafReward: 400,
//   },
// ]

// const dummyGroupChallengeCategories: GroupChallengeCategory[] = [
//   {
//     category: 'ZERO_WASTE',
//     label: '제로 웨이스트',
//     imageUrl: '/icon/category_zero_waste.png',
//   },
//   {
//     category: 'PLOGGING',
//     label: '플로깅',
//     imageUrl: '/icon/category_plogging.png',
//   },
//   {
//     category: 'CARBON_FOOTPRINT',
//     label: '탄소 발자국',
//     imageUrl: '/icon/category_carbon_reduction.png',
//   },
//   {
//     category: 'ENERGY_SAVING',
//     label: '에너지 절약',
//     imageUrl: '/icon/category_energy_saving.png',
//   },
//   {
//     category: 'UPCYCLING',
//     label: '업사이클',
//     imageUrl: '/icon/category_upcycle.png',
//   },
//   {
//     category: 'MEDIA',
//     label: '문화 공유',
//     imageUrl: '/icon/category_book_share.png',
//   },
//   {
//     category: 'DIGITAL_CARBON',
//     label: '디지털 탄소',
//     imageUrl: '/icon/category_digital_carbon.png',
//   },
//   {
//     category: 'VEGAN',
//     label: '비건',
//     imageUrl: '/icon/category_vegan.png',
//   },
// ]
