import Image from 'next/image'
import { useRouter } from 'next/navigation'

import { ReactNode } from 'react'
import styled from '@emotion/styled'

import { ChallengeCategoryType } from '@entities/challenge/type'
import { GroupChallengeCategory } from '@features/challenge/api/get-group-challenge-categories'
import { URL } from '@shared/constants/route/route'
import { responsiveHorizontalPadding } from '@shared/styles/ResponsiveStyle'

interface GroupChallengeSectionsProps {
  categories: GroupChallengeCategory[]
  className?: string
}

export const GroupChallengeSections = ({ categories, className }: GroupChallengeSectionsProps): ReactNode => {
  const router = useRouter()

  /** 카테고리 리스트로 이동 */
  const handleCategoryRoute = (category: ChallengeCategoryType) => {
    router.push(URL.CHALLENGE.GROUP.LIST.value(category))
  }

  return (
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
  )
}

const Section = styled.section`
  display: flex;
  flex-direction: column;
`

const SectionTitle = styled.h2`
  ${responsiveHorizontalPadding};

  position: relative;

  font-size: ${({ theme }) => theme.fontSize.xl};
  font-weight: ${({ theme }) => theme.fontWeight.semiBold};
`

const CategoryGrid = styled.div`
  margin-top: 20px;

  display: grid;
  grid-template-columns: repeat(8, 1fr);
`

const CategoryItem = styled.div`
  aspect-ratio: 1/1;
  border-radius: ${({ theme }) => theme.radius.lg};

  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;

  gap: 8px;
  font-size: ${({ theme }) => theme.fontSize.sm};
  color: ${({ theme }) => theme.colors.lfDarkGray.base};

  cursor: pointer;

  &:hover {
    background-color: #f5eee4;
  }
`

const CategoryLabel = styled.span`
  font-size: ${({ theme }) => theme.fontSize.xs};
  font-weight: ${({ theme }) => theme.fontWeight.semiBold};
`
