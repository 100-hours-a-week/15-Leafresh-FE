'use client'

import styled from '@emotion/styled'
import { useQuery } from '@tanstack/react-query'

import { BadgeData, getBadgeList } from '@entities/member/api/profile/badge/get-badge-list'
import { badgeCategory } from '@entities/member/model/constant'
import ApologizeContent from '@shared/components/apologize/ui/apologize'
import Loading from '@shared/components/loading/ui/loading'
import { theme } from '@shared/config/style/theme'
import { QUERY_OPTIONS } from '@shared/config/tanstack-query/query-defaults'
import { QUERY_KEYS } from '@shared/config/tanstack-query/query-keys'

import BadgeTabs from '../../../../../features/member/components/badge-tab/ui/badge-tab'

const BadgePage = () => {
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
    <Container>
      <Header>
        <Title>활동 뱃지</Title>
        <div style={{ width: '24px' }} />
      </Header>

      <BadgeTabs categories={badgeCategory} badgeData={badgeData} />
    </Container>
  )
}

export default BadgePage

const Container = styled.div`
  display: flex;
  flex-direction: column;
`

const Header = styled.header`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 12px 20px;
  background: ${theme.colors.lfWhite.base};
  /*  */
`

const Title = styled.h1`
  font-size: 18px;
  font-weight: 600;
  color: ${theme.colors.lfBlack.base};
  margin: 0;
`

const fallbackData: BadgeData = {
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
