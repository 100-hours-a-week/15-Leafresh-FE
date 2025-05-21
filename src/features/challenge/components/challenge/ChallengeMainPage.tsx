'use client'

import Autoplay from 'embla-carousel-autoplay'
import useEmblaCarousel from 'embla-carousel-react'
import Image from 'next/image'
import { useRouter } from 'next/navigation'

import { ReactNode } from 'react'
import styled from '@emotion/styled'
import { useQuery } from '@tanstack/react-query'

import { ChallengeCategoryType, DayType } from '@entities/challenge/type'
import { EventChallenge, getEventChallengeList } from '@features/challenge/api/get-event-challenge-list'
import {
  getGroupChallengeCategoryList,
  GroupChallengeCategory,
} from '@features/challenge/api/get-group-challenge-categories'
import { getPersonalChallengeList, PersonalChallengeType } from '@features/challenge/api/get-personal-challenge-list'
import Chatbot from '@shared/components/chatbot/Chatbot'
import { QUERY_OPTIONS } from '@shared/config/tanstack-query/query-defaults'
import { QUERY_KEYS } from '@shared/config/tanstack-query/query-keys'
import { URL } from '@shared/constants/route/route'
import { getDayOfWeek } from '@shared/lib/date/utils'
import { media } from '@shared/styles/emotion/media'
import { theme } from '@shared/styles/theme'

interface ChallengeMainPageProps {
  className?: string
}

const ChallengeMainPage = ({ className }: ChallengeMainPageProps): ReactNode => {
  const router = useRouter()
  const [emblaRef] = useEmblaCarousel({ loop: true, align: 'start', startIndex: 1 }, [
    Autoplay({ delay: 3000, stopOnInteraction: true }),
  ])

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

  const categories: GroupChallengeCategory[] = categoriesData?.data?.categories.slice(0, -1) ?? []
  const eventChallenges: EventChallenge[] = eventData?.data.eventChallenges ?? []
  const personalChallenges: PersonalChallengeType[] = personalData?.data.personalChallenges ?? []

  /** 카테고리 리스트로 이동 */
  const handleCategoryRoute = (category: ChallengeCategoryType) => {
    router.push(URL.CHALLENGE.GROUP.LIST.value(category))
  }

  return (
    <Container>
      <BannerSection>
        <BannerText>
          <SubTitle>사진 한 장, 지구를 위한 따듯한 걸음</SubTitle>
          <Title>
            친환경 챌린지 <strong>Leafresh</strong>
          </Title>
        </BannerText>
      </BannerSection>

      <Section>
        <SectionTitle>
          <span>챌린지 카테고리</span>
        </SectionTitle>
        <CategoryGrid>
          {categories.map(cat => (
            <CategoryItem key={cat.category} onClick={() => handleCategoryRoute(cat.category)}>
              <Image src={cat.imageUrl} alt={cat.label} width={48} height={48} />
              <CategoryLabel>{cat.label}</CategoryLabel>
            </CategoryItem>
          ))}
        </CategoryGrid>
      </Section>

      <Section>
        <SectionHeader>
          <SectionTitle>이벤트 챌린지</SectionTitle>
          <SubDescription>기간 한정! 이벤트 챌린지에 참여해보세요!</SubDescription>
        </SectionHeader>
        <CarouselWrapper ref={emblaRef}>
          <CarouselInner>
            {eventChallenges.length !== 0 ? (
              eventChallenges.map(ch => (
                <EventCard key={ch.id} onClick={() => router.push(URL.CHALLENGE.GROUP.DETAILS.value(ch.id))}>
                  <EventImage src={ch.thumbnailUrl} alt={ch.description} fill />
                </EventCard>
              ))
            ) : (
              <NoneContent>진행중인 이벤트 챌린지가 없습니다 !</NoneContent>
            )}
          </CarouselInner>
        </CarouselWrapper>
      </Section>

      <Section>
        <SectionHeader>
          <SectionTitle>일일 챌린지</SectionTitle>
          <SubDescription>다양한 사람들과 함께 챌린지에 참여해보세요!</SubDescription>
        </SectionHeader>
        <DailyCardWrapper>
          {personalChallenges.map(ch => (
            <DailyCard key={ch.id}>
              <CardTop>
                {/* <LeafWrapper>
                <LeafImage src={LeafIcon} alt='나뭇잎 아이콘' />
                <LeafLabel>{ch.leafReward}</LeafLabel>
              </LeafWrapper> */}
                <DailyImageArea>
                  <DailyImage src={ch.thumbnailUrl} alt={ch.description} fill />
                </DailyImageArea>
              </CardTop>
              <DailyCardDescriptions>
                <CardTitle>{ch.title}</CardTitle>
                <CardDescription>{ch.description}</CardDescription>
                <JoinButton onClick={() => router.push(URL.CHALLENGE.PERSONAL.DETAILS.value(ch.id))}>
                  자세히 보기
                </JoinButton>
              </DailyCardDescriptions>
            </DailyCard>
          ))}
        </DailyCardWrapper>
      </Section>
      <Chatbot />
    </Container>
  )
}

export default ChallengeMainPage

// === Styles ===

const Container = styled.div`
  padding-top: 250px;
  padding-bottom: 80px;

  display: flex;
  flex-direction: column;
  gap: 48px;
`

const BannerSection = styled.section`
  min-width: 320px;
  max-width: 500px;
  width: 100vw;
  height: 240px;

  position: absolute;
  top: 0;
  left: 0;

  background-image: url('/image/banner.png');
  background-size: cover;
  background-position: center;

  display: flex;
  align-items: flex-end;
  color: ${theme.colors.lfWhite.base};
`

const BannerText = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
  margin-left: 20px;
  margin-bottom: 40px;
`

const Title = styled.h1`
  font-size: ${theme.fontSize.xl};
  font-weight: ${theme.fontWeight.bold};
`

const SubTitle = styled.h2`
  font-size: ${theme.fontSize.base};
  margin-bottom: 8px;
`

const Section = styled.section`
  display: flex;
  flex-direction: column;
`

const SectionHeader = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  gap: 8px;
`

const SectionTitle = styled.h2`
  position: relative;

  font-size: ${theme.fontSize.lg};
  font-weight: ${theme.fontWeight.semiBold};
`

const SubDescription = styled.p`
  font-size: ${theme.fontSize.sm};
  font-weight: ${theme.fontWeight.medium};
  color: ${theme.colors.lfDarkGray.base};
`
const CategoryGrid = styled.div`
  margin-top: 20px;

  display: grid;
  grid-template-columns: repeat(4, 1fr);
`

const CategoryItem = styled.div`
  aspect-ratio: 1/1;
  border-radius: ${theme.radius.lg};

  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;

  gap: 8px;
  font-size: ${theme.fontSize.sm};
  color: ${theme.colors.lfDarkGray.base};

  cursor: pointer;

  &:hover {
    background-color: #f5eee4;
  }
`

const CategoryLabel = styled.span`
  font-size: ${theme.fontSize.xs};
  font-weight: ${theme.fontWeight.semiBold};
`

const CarouselWrapper = styled.div`
  width: 100%;
  /* height: 160px; */
  aspect-ratio: 5/3;

  position: relative;
  overflow: hidden;
  margin-top: 16px;
`

const CarouselInner = styled.div`
  width: 100%;
  height: 100%;

  position: relative;
  display: flex;
  gap: 8px;
  will-change: transform;
`
const EventCard = styled.div`
  width: 100%;

  background: ${theme.colors.lfInputBackground.base};
  border-radius: ${theme.radius.base};
  display: flex;
  flex-direction: row;
  gap: 12px;

  cursor: pointer;

  &:hover {
    opacity: 0.7;
  }
`

const EventImage = styled(Image)`
  width: 100%;
  /* height: 100%; */
  object-fit: cover;
  object-position: center center;
  border-radius: ${theme.radius.base};
`

const DailyCardWrapper = styled.div`
  width: 100%;
  margin-top: 20px;

  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
  gap: 20px;
`

const DailyCard = styled.div`
  width: 100%;
  background: ${theme.colors.lfWhite.base};
  border-radius: ${theme.radius.base};

  box-shadow: ${theme.shadow.lfInput};
`

const CardTop = styled.div`
  position: relative;

  display: flex;
  align-items: center;
  justify-content: space-between;
`

const LeafWrapper = styled.p`
  position: absolute;
  left: 0;
  top: 0;
  z-index: 20;

  display: flex;
  align-items: center;
  gap: 4px;
  font-weight: ${theme.fontWeight.semiBold};
`

const LeafImage = styled(Image)``

const LeafLabel = styled.span`
  font-size: ${theme.fontSize.sm};
`
const DailyImageArea = styled.div`
  width: 100%;
  aspect-ratio: 16/9;

  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;

  border-top-left-radius: ${theme.radius.base};
  border-top-right-radius: ${theme.radius.base};
  overflow: hidden;
`

const DailyImage = styled(Image)`
  object-fit: cover;
`

const JoinButton = styled.button`
  width: 100%;
  margin: 12px 0;
  padding: 16px 0;
  background-color: ${theme.colors.lfGreenMain.base};
  color: ${theme.colors.lfWhite.base};
  border-radius: ${theme.radius.base};
  font-size: ${theme.fontSize.base};
  font-weight: ${theme.fontWeight.semiBold};
  box-shadow: ${theme.shadow.lfInput};
  cursor: pointer;

  &:hover {
    background-color: ${theme.colors.lfGreenMain.hover};
  }
`
const DailyCardDescriptions = styled.div`
  padding: 0 16px;
  margin-top: 8px;
  margin-bottom: 8px;

  display: flex;
  flex-direction: column;
  gap: 14px;

  transition: all 0.3s ease; // optional: hover 부드럽게
`
const CardTitle = styled.h3`
  margin: 4px 0px;
  font-size: ${theme.fontSize.lg};
  font-weight: ${theme.fontWeight.semiBold};
`

const CardDescription = styled.p`
  font-size: ${theme.fontSize.sm};
  color: ${theme.colors.lfBlack.base};
  white-space: pre-wrap;
`

const NoneContent = styled.div`
  width: 100%;

  display: flex;
  align-items: center;
  justify-content: center;

  font-weight: ${theme.fontWeight.semiBold};
  font-size: ${theme.fontSize.lg};

  ${media.mobile} {
    font-size: ${theme.fontSize.sm};
  }
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
