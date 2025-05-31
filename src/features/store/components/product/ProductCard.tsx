'use client'

import Image from 'next/image'

import styled from '@emotion/styled'

import { theme } from '@shared/styles/theme'

import { Product } from '../api/get-products'

interface ProductCardProps {
  product: Product
}

const ProductCard = ({ product }: ProductCardProps) => {
  const { id, description, imageUrl, price, stock, title } = product

  return (
    <Card>
      <ThumbnailWrapper>
        <Thumbnail src={imageUrl} alt={title} width={180} height={180} />
      </ThumbnailWrapper>
      <TextContent>
        <Title>{title}</Title>
        <Description>{description}</Description>
        <PriceRow>
          <LeafIcon src='/icon/leaf.png' alt='leaf' width={16} height={16} />
          <Price>{price.toLocaleString()}</Price>
        </PriceRow>
        <StockNotice>남은 재고 {stock}개</StockNotice>
      </TextContent>
    </Card>
  )
}

export default ProductCard

const Card = styled.div`
  display: flex;
  flex-direction: column;
  overflow: hidden;
`

const ThumbnailWrapper = styled.div`
  width: 100%;
  aspect-ratio: 1 / 1;
  border-radius: ${theme.radius.base};
`

const Thumbnail = styled(Image)`
  width: 100%;
  height: 100%;
  object-fit: cover;
`

const TextContent = styled.div`
  padding: 10px 0;
`

const Title = styled.h3`
  margin: 12px 0 6px 0;
  font-size: ${theme.fontSize.base};
  font-weight: ${theme.fontWeight.semiBold};
`

const Description = styled.p`
  font-size: ${theme.fontSize.xs};
  color: ${theme.colors.lfBlack.base};
  margin-top: 4px;
`

const PriceRow = styled.div`
  display: flex;
  align-items: center;
  gap: 4px;
  margin: 10px 0 8px 0;
`

const Discount = styled.span`
  color: ${theme.colors.lfRed.base};
  font-weight: ${theme.fontWeight.semiBold};
`

const Price = styled.span`
  font-weight: ${theme.fontWeight.semiBold};
  color: ${theme.colors.lfBlack.base};
`

const OriginalPrice = styled.span`
  color: #aaa;
  font-size: ${theme.fontSize.sm};
  text-decoration: line-through;
`

const LeafIcon = styled(Image)`
  width: 16px;
  aspect-ratio: 1/1;
`

const StockNotice = styled.div`
  font-size: ${theme.fontSize.xs};
  color: ${theme.colors.lfDarkGray.base};
  margin-top: 4px;
`
