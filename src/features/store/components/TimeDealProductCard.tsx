// 'use client'

// import styled from '@emotion/styled'
// import { theme } from '@shared/styles/theme'
// import Image from 'next/image'
// import { TimeDealProduct } from '../api/get-timedeals'

// interface TimeDealProductCardProps {
//   product: TimeDealProduct
// }

// /** 타임딜 ㅏ */
// const TimeDealProductCard = ({ product }: TimeDealProductCardProps) => {
//   const {
//     dealId,
//     defaultPrice,
//     description,
//     discountedPercentage,
//     discountedPrice,
//     dealStartTime,
//     dealEndTime,
//     imageUrl,
//     productId,
//     stock,
//     timeDealStatus,
//     title,
//   } = product

//   return (
//     <Card>
//       <ThumbnailWrapper>
//         <Thumbnail src={imageUrl} alt={title} width={180} height={180} />
//       </ThumbnailWrapper>
//       <TextContent>
//         <Title>{title}</Title>
//         <Description>{description}</Description>
//         <PriceRow>
//           <Discount>{discountRate}%</Discount>
//           <LeafIcon src='/icon/leaf.png' alt='leaf' width={16} height={16} />
//           <Price>{price.toLocaleString()}</Price>
//           <OriginalPrice>{originalPrice.toLocaleString()}</OriginalPrice>
//         </PriceRow>
//         <StockNotice>남은 재고 {stock}개</StockNotice>
//       </TextContent>
//     </Card>
//   )
// }

// export default TimeDealProductCard

// const Card = styled.div`
//   display: flex;
//   flex-direction: column;
//   border-radius: ${theme.radius.base};
//   overflow: hidden;
//   background: white;
//   box-shadow: ${theme.shadow.lfInput};
// `

// const ThumbnailWrapper = styled.div`
//   width: 100%;
//   aspect-ratio: 1 / 1;
//   background: ${theme.colors.lfLightGray.base};
// `

// const Thumbnail = styled(Image)`
//   width: 100%;
//   height: 100%;
//   object-fit: cover;
// `

// const TextContent = styled.div`
//   padding: 10px;
// `

// const Title = styled.h3`
//   font-size: ${theme.fontSize.base};
//   font-weight: ${theme.fontWeight.semiBold};
// `

// const Description = styled.p`
//   font-size: ${theme.fontSize.sm};
//   color: ${theme.colors.lfDarkGray.base};
//   margin-top: 4px;
// `

// const PriceRow = styled.div`
//   display: flex;
//   align-items: center;
//   gap: 4px;
//   margin-top: 8px;
// `

// const Discount = styled.span`
//   color: ${theme.colors.lfRed.base};
//   font-weight: ${theme.fontWeight.semiBold};
// `

// const Price = styled.span`
//   font-weight: ${theme.fontWeight.semiBold};
//   color: ${theme.colors.lfBlack.base};
// `

// const OriginalPrice = styled.span`
//   color: #aaa;
//   font-size: ${theme.fontSize.sm};
//   text-decoration: line-through;
// `

// const LeafIcon = styled(Image)`
//   width: 16px;
//   height: 16px;
// `

// const StockNotice = styled.div`
//   font-size: ${theme.fontSize.xs};
//   color: ${theme.colors.lfDarkGray.base};
//   margin-top: 4px;
// `
