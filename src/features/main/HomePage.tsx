'use client'
import Image from 'next/image'
import { useRouter } from 'next/navigation'

import styled from '@emotion/styled'

import { URL } from '@shared/constants/route/route'
import { theme } from '@shared/styles/theme'

import ChallengeImageSlider from './ChallengeImageSlider'

const HomePage = () => {
  const router = useRouter()
  const challengeImages = [
    { url: '/image/Main_Challenge1.png' },
    { url: '/image/Main_Challenge2.png' },
    { url: '/image/Main_Challenge3.png' },
  ]

  return (
    <>
      <TreeSection>
        <Title>지구를 위한 실천 한 가지</Title>
        <Tree src='/image/Tree_Lv5.png' alt='LeafreshTree' width={273} height={188} />
      </TreeSection>
      <Section>
        <SubTitle>스스로 하나의 나뭇잎으로써</SubTitle>
        <Description>
          당신의 나무는 <span>몇 그루</span>인가요?
        </Description>
        <LeafreshImg src='/image/Main2.png' alt='Leafresh' width={190} height={190} />
      </Section>
      <Section>
        <SubTitle>챌린지 영역</SubTitle>
        <Description>
          AI 기반 지속가능성 분석과 친환경 실천 유도를 위한
          <br />
          챌린지 및 커뮤니티 플랫폼
        </Description>
        <ChallengeImageSlider images={challengeImages} />
      </Section>
      <Section>
        <ChallengeButton onClick={() => router.push(URL.CHALLENGE.INDEX.value)}>챌린지 참여하러 가기</ChallengeButton>
      </Section>
    </>
  )
}

export default HomePage

const TreeSection = styled.section`
  margin-top: 50px;
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
`

const Title = styled.h1`
  font-size: ${theme.fontSize.xl};
  color: ${theme.colors.lfGreenMain.base};
  font-weight: ${theme.fontWeight.semiBold};
`

const Tree = styled(Image)`
  margin-top: 15px;
`

const Section = styled.section`
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
`
const SubTitle = styled.h1`
  margin-top: 75px;
  margin-bottom: 25px;
  font-size: ${theme.fontSize.lg};
  font-weight: ${theme.fontWeight.bold};
`
const Description = styled.p`
  text-align: center;
  line-height: 1.4;
  font-size: ${theme.fontSize.md};
  span {
    font-weight: ${theme.fontWeight.semiBold};
  }
`
const LeafreshImg = styled(Image)`
  margin-top: 60px;
`
const ChallengeButton = styled.button`
  width: 80%;
  max-width: 328px;
  height: 56px;
  margin-bottom: 70px;

  cursor: pointer;
  background-color: ${theme.colors.lfGreenMain.base};
  color: ${theme.colors.lfWhite.base};
  font-size: ${theme.fontSize.base};
  font-weight: ${theme.fontWeight.medium};
  border-radius: ${theme.radius.md};
  box-shadow: ${theme.shadow.lfPrime};

  :hover {
    background-color: ${theme.colors.lfGreenMain.hover};
  }
`
