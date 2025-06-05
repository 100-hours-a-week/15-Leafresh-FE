'use client'

import Image from 'next/image'

import styled from '@emotion/styled'

const Introduce = () => {
  return (
    <Wrapper>
      <Image src='/image/main/character.svg' alt='친환경 캐릭터' width={300} height={300} />
      <ItemWrapper>
        <Item>
          <StyledImage src='/image/main/verification.svg' alt='챌린지 인증' width={50} height={50} />
          <DataWrapper>
            <Count>15,827</Count>
            <Text>인증 수</Text>
          </DataWrapper>
        </Item>
        <Item>
          <StyledImage src='/image/main/leaf.svg' alt='친환경 인증' width={50} height={50} />
          <DataWrapper>
            <Count>15,827</Count>
            <Text>나뭇잎 수</Text>
          </DataWrapper>
        </Item>
      </ItemWrapper>
      <IntroduceText>사진 한 장, 지구를 지키는 가장 쉬운 방법</IntroduceText>
    </Wrapper>
  )
}

export default Introduce

const Wrapper = styled.section`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
  padding: 24px 20px 0;
  gap: 8px;
`
const ItemWrapper = styled.div`
  margin-top: 28px;
  padding-bottom: 16px;
  display: flex;
  align-items: center;
  gap: 20px;

  border-bottom: 1px solid #03452e;
`

const Item = styled.div`
  flex: 1;
  display: flex;
  align-items: center;
  gap: 12px;
  text-align: center;
`

const DataWrapper = styled.div`
  font-weight: ${({ theme }) => theme.fontWeight.semiBold};
  display: flex;
  flex-direction: column;
  gap: 10px;
`
const Count = styled.div`
  font-size: 28px;
`

const Text = styled.p`
  font-size: ${({ theme }) => theme.fontSize.base};
  font-weight: ${({ theme }) => theme.fontWeight.regular};
  color: ${({ theme }) => theme.colors.lfBlack.base};
`

const StyledImage = styled(Image)`
  width: 48px;
  height: 48px;
  object-fit: contain;
`

const IntroduceText = styled.span`
  margin-top: 23px;
  font-size: 26px;
  color: #2a5237;
  font-weight: ${({ theme }) => theme.fontWeight.bold};
`
