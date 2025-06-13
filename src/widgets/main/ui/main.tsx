'use client'

import { ReactNode } from 'react'

import { EventChallenge, getEventChallengeList } from '@entities/challenge/api/get-event-challenge-list'
import {
  getGroupChallengeCategoryList,
  GroupChallengeCategory,
} from '@entities/challenge/api/get-group-challenge-categories'
import { getPersonalChallengeList, PersonalChallengeType } from '@entities/challenge/api/get-personal-challenge-list'
import { DayType } from '@entities/challenge/model/type'
import { EventSection, GroupChallengeSections, PersonalChallengeSection } from '@features/main/components'
import { QUERY_OPTIONS } from '@shared/config/tanstack-query/query-defaults'
import { QUERY_KEYS } from '@shared/config/tanstack-query/query-keys'
import { getDayOfWeek } from '@shared/lib/date/utils'

import * as S from './styles'

import { useQuery } from '@tanstack/react-query'

export const MainPage = (): ReactNode => {
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
    <S.Container>
      <EventSection eventChallenges={eventChallenges} />
      <PersonalChallengeSection personalChallenges={personalChallenges} />
      <GroupChallengeSections categories={categories} />
    </S.Container>
  )
}
