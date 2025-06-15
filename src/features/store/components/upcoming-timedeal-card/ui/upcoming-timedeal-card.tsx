import { format } from 'date-fns'
import Autoplay from 'embla-carousel-autoplay'
import useEmblaCarousel from 'embla-carousel-react'
import Image from 'next/image'
import { ReactNode, useRef } from 'react'

import ApologizeContent from '@shared/components/apologize/ui/apologize'

import { UpcomingTimeDealCardProps } from '../model/types'
import * as S from './styles'

export const UpcomingTimeDealCard = ({ data, className }: UpcomingTimeDealCardProps): ReactNode => {
  const autoplay = useRef(Autoplay({ delay: 3000, stopOnInteraction: false }))
  const [emblaRef] = useEmblaCarousel({ loop: true }, [autoplay.current])

  let content
  /** 다가오는 특가 상품이 없는 경우 */
  if (data.length === 0) {
    content = (
      <ApologizeContent title='예정된 특가 상품이 없습니다' description='빠른 시일 내로 좋은 상품으로 찾아뵙겠습니다' />
    )
  } else {
    /** 다가오는 특가 상품이 있는 경우 */
    content = (
      <S.CarouselWrapper ref={emblaRef}>
        <S.CarouselInner>
          {data.map(item => (
            <S.CarouselSlide key={item.dealId}>
              <S.UpcomingImageBox>
                <Image src={item.imageUrl} alt={item.title} fill style={{ objectFit: 'cover' }} />
                <S.UpcomingDateText>{format(new Date(item.dealStartTime), 'M월 d일 HH:mm')} 오픈</S.UpcomingDateText>
              </S.UpcomingImageBox>
              <S.DescriptionSection>
                <S.Title>{item.title}</S.Title>
                <S.Description>{item.description}</S.Description>
                <S.PriceRow>
                  <S.Discount>{item.discountedPercentage}%</S.Discount>
                  <S.Price>
                    <S.LeafIcon src='/icon/leaf.png' alt='leaf' width={24} height={24} /> {item.discountedPrice}
                  </S.Price>
                  <S.Origin>{item.defaultPrice}</S.Origin>
                </S.PriceRow>
              </S.DescriptionSection>
            </S.CarouselSlide>
          ))}
        </S.CarouselInner>
      </S.CarouselWrapper>
    )
  }

  return (
    <S.UpcomingSection>
      <S.SectionTitle>다가오는 특가 상품</S.SectionTitle>
      <S.SubText>놓치면 후회할 가격!</S.SubText>
      {content}
    </S.UpcomingSection>
  )
}
