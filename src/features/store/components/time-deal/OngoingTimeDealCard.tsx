import Image from 'next/image'

import { ReactNode } from 'react'
import styled from '@emotion/styled'

import { TimeDealProduct } from '@features/store/api/get-timedeals'
import useRemainingTime from '@features/store/hook/useRemainingTime'
import LucideIcon from '@shared/lib/ui/LucideIcon'
import { media } from '@shared/styles/emotion/media'
import { theme } from '@shared/styles/theme'

interface OngoingTimeDealCardProps {
  data: TimeDealProduct | undefined
  className?: string
}

const OngoingTimeDealCard = ({ data, className }: OngoingTimeDealCardProps): ReactNode => {
  const remaining = useRemainingTime({ target: data?.dealEndTime ?? '' })

  let content
  /** 진행중인 타임딜 상품이 없는 경우 */
  if (!data) {
    content = (
      <EmptySection>
        <Image src='/image/apologize_character.svg' alt='사죄 이미지' width={140} height={140} />
        <EmptyTitle>진행 중인 특가 상품이 없습니다</EmptyTitle>
        <EmptyDescription>빠른 시일 내로 좋은 상품으로 찾아뵙겠습니다</EmptyDescription>
        <EmptyDescription>감사합니다.</EmptyDescription>
      </EmptySection>
    )
  } else {
    /** 진행중인 타임딜 상품이 있는 경우 */
    const {
      dealEndTime,
      imageUrl,
      title,
      timeDealStatus,
      description,
      discountedPercentage,
      discountedPrice,
      defaultPrice,
      stock,
    } = data

    content = (
      <OngoingCard>
        <Timer>
          <LucideIcon name='Hourglass' size={24} />
          {data ? remaining : ''}
        </Timer>
        <InfoCard>
          <OngoingImageBox>
            <Image src={imageUrl} alt={title} fill style={{ objectFit: 'cover' }} />
          </OngoingImageBox>
          <DescriptionSection>
            <Title>{title}</Title>
            <Description>{description}</Description>
            <PriceBox>
              <Left>
                <Discount>{discountedPercentage}%</Discount>
                <Price>
                  <LeafIcon src='/icon/leaf.png' alt='leaf' width={24} height={24} /> {discountedPrice}
                </Price>
                <Origin>{defaultPrice}</Origin>
              </Left>
              <Stock>남은 재고 {stock}개</Stock>
            </PriceBox>
            <BuyButton type='button'>구매하기</BuyButton>
          </DescriptionSection>
        </InfoCard>
      </OngoingCard>
    )
  }

  return (
    <OngoingCard>
      <OngoingTitle>🔥 특가 상품</OngoingTitle>
      <SubText>세상은 1등만 기억해!</SubText>
      {content}
    </OngoingCard>
  )
}

export default OngoingTimeDealCard

const EmptySection = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 40px;
`

const EmptyTitle = styled.div`
  font-size: ${theme.fontSize.lg};
  font-weight: ${theme.fontWeight.semiBold};
  margin: 16px 0 16px 0;
`

const EmptyDescription = styled.p`
  font-size: ${theme.fontSize.base};
  color: ${theme.colors.lfDarkGray.base};
  margin-top: 6px;
  text-align: center;
`

const OngoingCard = styled.div`
  margin: 20px 0;
`
const OngoingTitle = styled.h2`
  font-size: ${theme.fontSize.lg};
  font-weight: ${theme.fontWeight.semiBold};
`

const SubText = styled.p`
  margin: 8px 0px;
  color: ${theme.colors.lfDarkGray.base};
  font-size: ${theme.fontSize.sm};

  ${media.afterMobile} {
    font-size: ${theme.fontSize.base};
  }
`
const Timer = styled.div`
  font-size: 24px;
  font-weight: bold;
  margin: 16px 0;

  display: flex;
  align-items: center;
  gap: 4px;
`

const InfoCard = styled.div`
  box-shadow: ${theme.shadow.lfInput};
  border-radius: ${theme.radius.sm};

  cursor: pointer;
`

const OngoingImageBox = styled.div`
  width: 100%;

  position: relative;
  border-top-right-radius: ${theme.radius.md};
  border-top-left-radius: ${theme.radius.md};
  overflow: hidden;
  aspect-ratio: 2/1;
`

const DescriptionSection = styled.div`
  padding: 10px 14px;
`

const Title = styled.h3`
  padding: 4px 0;
  font-size: ${theme.fontSize.base};
  font-weight: ${theme.fontWeight.bold};

  ${media.afterMobile} {
    font-size: ${theme.fontSize.lg};
  }
`

const Description = styled.p`
  font-size: ${theme.fontSize.sm};
  margin: 8px 0;

  ${media.afterMobile} {
    font-size: ${theme.fontSize.base};
    margin: 12px 0;
  }
`

const PriceBox = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 16px;
`

const Left = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
`

const Discount = styled.span`
  color: #ff7043;
  font-weight: ${theme.fontWeight.bold};
`

const Price = styled.span`
  font-size: ${theme.fontSize.base};
  font-weight: ${theme.fontWeight.semiBold};

  display: flex;
  align-items: center;
  gap: 3px;
`

const Origin = styled.del`
  font-size: ${theme.fontSize.sm};
  color: ${theme.colors.lfGray.base};
`

const Stock = styled.span`
  font-size: ${theme.fontSize.sm};
`

const BuyButton = styled.button`
  margin-top: 12px;
  width: 100%;
  height: 44px;
  background: ${theme.colors.lfGreenMain.base};
  color: ${theme.colors.lfWhite.base};
  border-radius: ${theme.radius.base};
  font-weight: ${theme.fontWeight.medium};
  font-size: ${theme.fontSize.sm};
  cursor: pointer;

  ${media.afterMobile} {
    font-size: ${theme.fontSize.base};
  }
`

const LeafIcon = styled(Image)`
  width: 24px;
  aspect-ratio: 1/1;
`
