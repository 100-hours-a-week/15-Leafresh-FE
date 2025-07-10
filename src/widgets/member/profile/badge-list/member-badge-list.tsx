'use client'

import { useQuery } from '@tanstack/react-query'

import { BadgeTab } from '@/features/member/components'

import { BadgeData, getBadgeList } from '@/entities/member/api'
import { badgeCategory } from '@/entities/member/model'

import { ApologizeContent, Loading } from '@/shared/components'
import { QUERY_KEYS, QUERY_OPTIONS } from '@/shared/config'

import { fallbackData } from './consts'
import * as S from './styles'

export const BadgePage = () => {
  const {
    data: badgeListData,
    isLoading,
    isError,
  } = useQuery({
    queryKey: QUERY_KEYS.MEMBER.BADGES.LIST,
    queryFn: getBadgeList,
    ...QUERY_OPTIONS.MEMBER.BADGES.LIST,
    refetchOnWindowFocus: true, //포커스 시 api 호출
  })

  if (isError || !badgeListData?.data?.badges)
    return <ApologizeContent title='뱃지를 불러올 수 없습니다.' description='다시 시도해 주세요.' />

  // const badgeList: BadgeListResponse = badgeListdata?.data ?? ({} as BadgeListResponse)
  const badgeData: BadgeData =
    badgeListData?.data.badges && Object.keys(badgeListData.data.badges).length > 0
      ? badgeListData.data.badges
      : fallbackData

  if (isLoading) return <Loading />
  return (
    <S.Container>
      <S.Header>
        <S.Title>활동 뱃지</S.Title>
        <div style={{ width: '24px' }} />
      </S.Header>

      <BadgeTab categories={badgeCategory} badgeData={badgeData} />
    </S.Container>
  )
}
