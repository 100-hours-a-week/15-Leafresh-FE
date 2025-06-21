'use client'

import Image from 'next/image'

import styled from '@emotion/styled'
import { useQuery } from '@tanstack/react-query'

import { getLeafAccumulateCount, getVerificationAccumulateCount } from '@/entities/common/api'

import { QUERY_KEYS, QUERY_OPTIONS } from '@/shared/config'
import { useCountUp } from '@/shared/hooks'

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

  //TODO: 누적 인증 수 API 연결되면 해제
  // const animatedVerificationCount = useCountUp(verificationCount ?? 0, 1200)
  const animatedVerificationCount = useCountUp(verificationCount ?? 0, 3000)
  const animatedLeafCount = useCountUp(leafCount ?? 0, 3000)

  return (
    <Wrapper>
      <Image src='/image/main/character.svg' alt='친환경 캐릭터' width={400} height={400} />
      <ItemWrapper>
        <StyledImage src='/image/main/verification.svg' alt='챌린지 인증' width={100} height={100} />
        <DataWrapper>
          <Count>{isVerificationLoading ? '불러오는 중...' : animatedVerificationCount?.toLocaleString()}</Count>
          <Text>인증 수</Text>
        </DataWrapper>
        <StyledImage src='/image/main/leaf.svg' alt='친환경 인증' width={100} height={100} />
        <DataWrapper>
          <Count>{isLeafLoading ? '불러오는 중...' : animatedLeafCount?.toLocaleString()}</Count>
          <Text>나뭇잎 수</Text>
        </DataWrapper>
      </ItemWrapper>
      <IntroduceText>사진 한 장, 지구를 지키는 가장 쉬운 방법</IntroduceText>
    </Wrapper>
  )
}

const Wrapper = styled.section`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
  gap: 8px;

  @media (max-width: 1150px) {
    display: none;
  }
`
const ItemWrapper = styled.div`
  margin-top: 28px;
  padding-bottom: 16px;
  display: grid;
  grid-template-columns: 100px 120px 100px 120px; // 4열 구성
  place-items: center;

  gap: 15px;

  border-bottom: 1px solid #03452e;

  align-items: center;
`

const DataWrapper = styled.div`
  grid-row: span 2;
  place-self: center;
  display: flex;
  flex-direction: column;
  gap: 12px;
  align-items: center;
  justify-content: center;

  font-weight: ${({ theme }) => theme.fontWeight.semiBold};
`
const Count = styled.div`
  font-size: 36px;
`

const Text = styled.p`
  font-size: 20px;
  font-weight: ${({ theme }) => theme.fontWeight.medium};
  color: ${({ theme }) => theme.colors.lfBlack.base};
`

const StyledImage = styled(Image)`
  width: 100px;
  height: 100px;
  object-fit: contain;
  grid-row: span 2; // ← 여기서 이미지가 두 줄 차지
`

const IntroduceText = styled.span`
  margin-top: 23px;
  font-size: 28px;
  color: #2a5237;
  font-weight: ${({ theme }) => theme.fontWeight.bold};
`
