'use client'

import Autoplay from 'embla-carousel-autoplay'
import useEmblaCarousel from 'embla-carousel-react'
import Image from 'next/image'
import { useRouter } from 'next/navigation'

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
import { URL } from '@shared/constants/route/route'
import { QUERY_KEYS } from '@shared/constants/tanstack-query/query-keys'
import { getDayOfWeek } from '@shared/lib/date/utils'
import { theme } from '@shared/styles/theme'

export const dummyEventChallenges: EventChallenge[] = [
  {
    id: 1,
    title: '[1.환경의날]',
    description: '이벤트이벤트이벤트\n이벤트이벤트이벤트\n이벤트이벤트이벤트',
    imageUrl: '/icon/category_zero_waste.png',
  },
  {
    id: 2,
    title: '[2.에너지 절약]',
    description: '조명을 꺼요\n절약해요\n함께해요',
    imageUrl: '/icon/category_zero_waste.png',
  },
  {
    id: 3,
    title: '[3.에너지 절약]',
    description: '조명을 꺼요\n절약해요\n함께해요',
    imageUrl: '/icon/category_zero_waste.png',
  },
  {
    id: 4,
    title: '[4.에너지 절약]',
    description: '조명을 꺼요\n절약해요\n함께해요',
    imageUrl: '/icon/category_zero_waste.png',
  },
]

export const dummyPersonalChallenges: PersonalChallengeType[] = [
  {
    id: 1,
    title: '챌린지 제목',
    description: '챌린지 설명',
    imageUrl: '123',
    leafReward: 400,
  },
  {
    id: 2,
    title: '챌린지 제목',
    description: '챌린지 설명',
    imageUrl: '123',
    leafReward: 400,
  },
]

export const dummyGroupChallengeCategories: GroupChallengeCategory[] = [
  {
    category: 'ZERO_WASTE',
    label: '제로웨이스트',
    imageUrl: '/icon/category_zero_waste.png',
  },
  {
    category: 'PLOGGING',
    label: '플로깅',
    imageUrl: '/icon/category_plogging.png',
  },
  {
    category: 'CARBON_REDUCTION',
    label: '탄소 발자국',
    imageUrl: '/icon/category_carbon_reduction.png',
  },
  {
    category: 'ENERGY_SAVING',
    label: '에너지 절약',
    imageUrl: '/icon/category_energy_saving.png',
  },
  {
    category: 'UPCYCLE',
    label: '업사이클',
    imageUrl: '/icon/category_upcycle.png',
  },
  {
    category: 'BOOK_SHARE',
    label: '문화 공유',
    imageUrl: '/icon/category_book_share.png',
  },
  {
    category: 'DIGITAL_CARBON',
    label: '디지털 탄소',
    imageUrl: '/icon/category_digital_carbon.png',
  },
  {
    category: 'VEGAN',
    label: '비건',
    imageUrl: '/icon/category_vegan.png',
  },
]
interface ChallengeMainPageProps {
  className?: string
}

const ChallengeMainPage = ({ className }: ChallengeMainPageProps): ReactNode => {
  const router = useRouter()
  const [emblaRef] = useEmblaCarousel({ loop: true, align: 'center' }, [
    Autoplay({ delay: 3000, stopOnInteraction: true, stopOnFocusIn: true }),
  ])

  const dayOfWeek: DayType = getDayOfWeek(new Date()) // 클라이언트 기준

  const { data: categoriesData } = useQuery({
    queryKey: QUERY_KEYS.CHALLENGE.GROUP.CATEGORIES,
    queryFn: getGroupChallengeCategoryList,
  })

  const { data: eventData } = useQuery({
    queryKey: QUERY_KEYS.CHALLENGE.EVENT.LIST,
    queryFn: getEventChallengeList,
  })

  const { data: personalData } = useQuery({
    queryKey: QUERY_KEYS.CHALLENGE.PERSONAL.LIST(dayOfWeek),
    queryFn: () => getPersonalChallengeList({ dayOfWeek }),
  })

  /** TODO: DB에 데이터가 채워지면 해당 상수로 교체 */
  // const categories = categoriesData?.data ?? []
  // const eventChallenges = eventData?.data ?? []
  // const personalChallenges = personalData?.data ?? []
  const groupChallengeCategories: GroupChallengeCategory[] = dummyGroupChallengeCategories
  const eventChallenges: EventChallenge[] = dummyEventChallenges
  const personalChallenges: PersonalChallengeType[] = dummyPersonalChallenges

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
        <SectionTitle>챌린지 카테고리</SectionTitle>
        <CategoryGrid>
          {groupChallengeCategories.map(cat => (
            <CategoryItem key={cat.category}>
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
          <MoreEventChallengeButton onClick={() => router.push(URL.CHALLENGE.GROUP.LIST.value('ETC'))}>
            더보기
          </MoreEventChallengeButton>
        </SectionHeader>
        <CarouselWrapper ref={emblaRef}>
          <CarouselInner>
            {eventChallenges.map(ch => (
              <EventCard key={ch.id}>
                <ImageArea>
                  <Image src={ch.imageUrl} alt={ch.description} width={48} height={48} />
                </ImageArea>
                <CardArea>
                  <CardTitle>{ch.title}</CardTitle>
                  <CardDescription>{ch.description}</CardDescription>
                </CardArea>
              </EventCard>
            ))}
          </CarouselInner>
        </CarouselWrapper>
      </Section>

      <Section>
        <SectionHeader>
          <SectionTitle>일일 챌린지</SectionTitle>
          <SubDescription>다양한 사람들과 함께 챌린지에 참여해보세요!</SubDescription>
        </SectionHeader>
        {personalChallenges.map(ch => (
          <DailyCard key={ch.id}>
            <CardTop>
              <RewardIcon>🌱 {ch.leafReward}</RewardIcon>
              <div>이미지 영역</div>
              {/* <CardImage src={ch.imageUrl} alt={ch.title} width={100} height={100} /> */}
            </CardTop>
            <JoinButton>참여하기</JoinButton>
            <CardTitle>{ch.title}</CardTitle>
            <CardDescription>{ch.description}</CardDescription>
          </DailyCard>
        ))}
      </Section>
    </Container>
  )
}

export default ChallengeMainPage

// === Styles ===
const Container = styled.div`
  padding-top: 240px;
  padding-bottom: 80px;

  display: flex;
  flex-direction: column;
  gap: 64px;
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
  gap: 10px;
`

const SectionHeader = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  gap: 8px;
`

const SectionTitle = styled.h2`
  font-size: ${theme.fontSize.lg};
  font-weight: ${theme.fontWeight.semiBold};
`

const SubDescription = styled.p`
  font-size: ${theme.fontSize.sm};
  font-weight: ${theme.fontWeight.medium};
  color: ${theme.colors.lfDarkGray.base};
`

const MoreEventChallengeButton = styled.button`
  position: absolute;
  right: 0;
  bottom: 0;

  font-size: ${theme.fontSize.sm};
  color: ${theme.colors.lfBlue.base};
  cursor: pointer;

  &:hover {
    color: ${theme.colors.lfBlue.hover};
  }
`

const CategoryGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 24px 0;
  margin-top: 24px;
`

const CategoryItem = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 6px;
  font-size: ${theme.fontSize.sm};
  color: ${theme.colors.lfDarkGray.base};
`

const CategoryLabel = styled.span`
  font-size: ${theme.fontSize.xs};
  font-weight: ${theme.fontWeight.semiBold};
`

const CarouselWrapper = styled.div`
  height: 200px;
  overflow: hidden;
  margin-top: 16px;
`

const CarouselInner = styled.div`
  height: 100%;
  padding: 0 20px;

  position: relative;
  display: flex;
  gap: 12px;
  will-change: transform;
`
const EventCard = styled.div`
  height: 100%;
  aspect-ratio: 16/9;

  flex: 0 0 auto;
  background: ${theme.colors.lfLightGray.base};
  border-radius: ${theme.radius.base};
  display: flex;
  flex-direction: row;
  padding: 16px;
  gap: 12px;
`
const ImageArea = styled.div`
  flex-basis: 40%;
  display: flex;
  align-items: center;
  justify-content: center;
`
const CardArea = styled.div`
  flex-basis: 60%;
  padding: 10px 10px;

  display: flex;
  flex-direction: column;
  gap: 12px;
`

const DailyCard = styled.div`
  background: ${theme.colors.lfLightGray.base};
  border-radius: ${theme.radius.base};
  padding: 16px;
  margin-top: 16px;
`

const CardTop = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 8px;
`

const RewardIcon = styled.div`
  font-size: ${theme.fontSize.sm};
  color: ${theme.colors.lfGreenMain.base};
`

const JoinButton = styled.button`
  width: 100%;
  margin: 12px 0;
  padding: 8px 0;
  background-color: ${theme.colors.lfGreenMain.base};
  color: ${theme.colors.lfWhite.base};
  border-radius: ${theme.radius.base};
  font-size: ${theme.fontSize.sm};
`
const CardTitle = styled.h3`
  font-size: ${theme.fontSize.md};
  font-weight: ${theme.fontWeight.semiBold};
`

const CardDescription = styled.p`
  font-size: ${theme.fontSize.base};
  color: ${theme.colors.lfDarkGray.base};
  white-space: pre-wrap;
`

// const CardImage = styled(Image)`
//   border-radius: ${theme.radius.base};
//   object-fit: cover;
// `

const TempCategoryImageArea = styled.div``
