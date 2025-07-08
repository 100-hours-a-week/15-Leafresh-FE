'use client'

import Image from 'next/image'

import { useQuery } from '@tanstack/react-query'

import { getLeafAccumulateCount, getVerificationAccumulateCount } from '@/entities/common/api'

import { QUERY_KEYS, QUERY_OPTIONS } from '@/shared/config'
import { useCountUp } from '@/shared/hooks'

import * as S from './styles'

export const Introduce = () => {
  const { data: verificationCountData, isLoading: isVerificationLoading } = useQuery({
    queryKey: QUERY_KEYS.CHALLENGE.ETC.COUNT.VERIFICATION,
    queryFn: getVerificationAccumulateCount,
    ...QUERY_OPTIONS.CHALLENGE.ETC.COUNT.VERIFICATION,
  })

  const { data: leafCountData, isLoading: isLeafLoading } = useQuery({
    queryKey: QUERY_KEYS.STORE.ETC.COUNT.LEAVES,
    queryFn: getLeafAccumulateCount,
    ...QUERY_OPTIONS.STORE.ETC.COUNT.LEAVES,
  })

  const verificationCount = verificationCountData?.data.count
  const leafCount = leafCountData?.data.count

  const animatedVerificationCount = useCountUp(verificationCount ?? 0, 3000)
  const animatedLeafCount = useCountUp(leafCount ?? 0, 3000)

  return (
    <S.Wrapper>
      <Image src='/image/main/character.svg' alt='친환경 캐릭터' width={400} height={400} />
      <S.ItemWrapper>
        <S.StyledImage src='/image/main/verification.svg' alt='챌린지 인증' width={100} height={100} />
        <S.DataWrapper>
          <S.Count>{isVerificationLoading ? '불러오는 중...' : animatedVerificationCount?.toLocaleString()}</S.Count>
          <S.Text>인증 수</S.Text>
        </S.DataWrapper>
        <S.StyledImage src='/image/main/leaf.svg' alt='친환경 인증' width={100} height={100} />
        <S.DataWrapper>
          <S.Count>{isLeafLoading ? '불러오는 중...' : animatedLeafCount?.toLocaleString()}</S.Count>
          <S.Text>나뭇잎 수</S.Text>
        </S.DataWrapper>
      </S.ItemWrapper>
      <S.IntroduceText>사진 한 장, 지구를 지키는 가장 쉬운 방법</S.IntroduceText>
    </S.Wrapper>
  )
}
