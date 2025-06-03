'use client'

import Image from 'next/image'
import { useRouter } from 'next/navigation'

import { ReactNode, useEffect, useRef } from 'react'
import styled from '@emotion/styled'

import { PurchaseProduct } from '@features/member/api/store/get-order-list'
import { useInfiniteMemberStoreOrderList } from '@features/member/hooks/useInfiniteMemberStoreOrderList'
import NoContent from '@shared/components/no-content/no-content'
import { URL } from '@shared/constants/route/route'
import { getTimeDiff } from '@shared/lib/date/utils'
import { responsiveHorizontalPadding } from '@shared/styles/ResponsiveStyle'
import { theme } from '@shared/styles/theme'
import { ISOFormatString } from '@shared/types/date'
import LeafIcon from '@public/icon/leaf.png'

/** 더미 데이터 */
const dummyMemberStoreOrderList: PurchaseProduct[] = [
  {
    id: 1,
    product: {
      id: 101,
      title:
        '맛있는 나뭇잎 상점 구매 품목맛있는 나뭇잎 상점 구매 품목맛있는 나뭇잎 상점 구매 품목맛있는 나뭇잎 상점 구매 품목',
      imageUrl: '/image/Main_1.png',
    },
    quantity: 1,
    price: 500,
    purchasedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 3).toISOString() as ISOFormatString, // 3일 전
  },
  {
    id: 2,
    product: {
      id: 102,
      title: '맛있는 나뭇잎 상점 구매 품목',
      imageUrl: '/image/Main_1.png',
    },
    quantity: 1,
    price: 500,
    purchasedAt: new Date(Date.now() - 30 * 1000 * 60 * 60 * 24 * 2).toISOString() as ISOFormatString,
  },
  {
    id: 3,
    product: {
      id: 103,
      title: '맛있는 나뭇잎 상점 구매 품목',
      imageUrl: '/image/Main_1.png',
    },
    quantity: 1,
    price: 500,
    purchasedAt: new Date(Date.now() - 990 * 60 * 60 * 24 * 1).toISOString() as ISOFormatString,
  },
  {
    id: 4,
    product: {
      id: 104,
      title: '맛있는 나뭇잎 상점 구매 품목',
      imageUrl: '/image/Main_1.png',
    },
    quantity: 1,
    price: 500,
    purchasedAt: new Date().toISOString() as ISOFormatString, // 오늘
  },
]
// const dummyMemberStoreOrderList: PurchaseProduct[] = []

const MemberOrderListPage = (): ReactNode => {
  const router = useRouter()
  const { data, isLoading, isFetchingNextPage, fetchNextPage, hasNextPage } = useInfiniteMemberStoreOrderList()

  const observerRef = useRef<HTMLDivElement>(null)

  // TODO: API 연결 확인 후 실제 데이터로 바꾸기
  // const products = data?.pages.flatMap(page => page.data.purchases) ?? []
  const products = dummyMemberStoreOrderList

  useEffect(() => {
    if (!hasNextPage || isFetchingNextPage) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          fetchNextPage()
        }
      },
      { rootMargin: '100px' },
    )

    if (observerRef.current) observer.observe(observerRef.current)
    return () => observer.disconnect()
  }, [hasNextPage, isFetchingNextPage, fetchNextPage])

  let contents
  // 데이터가 없는 경우
  const isEmpty = !products || products.length === 0
  if (isEmpty) {
    contents = (
      <NoContent
        title='구매내역이 없습니다'
        buttonText='구매하러 가기'
        clickHandler={() => {
          router.push(URL.STORE.INDEX.value)
        }}
      />
    )
  } else {
    contents = products.map(product => <ProductCard data={product} key={product.id} />)
  }
  return (
    <Container>
      <Header>
        <Title>나뭇잎 상점 구매내역</Title>
        <LinkButton
          onClick={() => {
            router.push(URL.STORE.INDEX.value)
          }}
          type='button'
        >
          상점 가기
        </LinkButton>
      </Header>
      <Grid isEmpty={isEmpty}>{contents}</Grid>
      {hasNextPage && <Observer ref={observerRef} />}
    </Container>
  )
}

export default MemberOrderListPage

interface ProductCardProps {
  data: PurchaseProduct
  className?: string
}

const ProductCard = ({ data, className }: ProductCardProps): ReactNode => {
  const { id: orderId, price, product, purchasedAt, quantity } = data
  const { id: productId, imageUrl, title } = product
  return (
    <Card key={orderId}>
      <ThumbnailWrapper>
        <Image src={imageUrl} alt={title} fill style={{ objectFit: 'cover' }} />
      </ThumbnailWrapper>
      <ProductTitle>{title}</ProductTitle>
      <InfoRow>
        <PriceRow>
          <Image src={LeafIcon} alt='leaf' width={24} height={24} />
          <Price>{price}</Price>
        </PriceRow>
        <TimeAgo>{getTimeDiff(purchasedAt)}</TimeAgo>
      </InfoRow>
    </Card>
  )
}

const Container = styled.div`
  ${responsiveHorizontalPadding};

  display: flex;
  flex-direction: column;
  gap: 16px;
`

const Header = styled.div`
  /* padding: 16px; */

  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`

const Title = styled.h1`
  font-size: ${theme.fontSize.lg};
  font-weight: ${theme.fontWeight.bold};
`

const LinkButton = styled.button`
  margin: 6px 0;

  align-self: flex-end;
  font-size: ${theme.fontSize.sm};
  color: ${theme.colors.lfBlue.base};
  font-weight: ${theme.fontWeight.medium};

  cursor: pointer;
`

const Grid = styled.div<{ isEmpty?: boolean }>`
  display: grid;
  ${({ isEmpty }) =>
    isEmpty
      ? `
    grid-template-columns: 1fr;
    place-items: center;
    min-height: 40vh;
  `
      : `
    grid-template-columns: repeat(2, 1fr);
    row-gap: 16px;
    column-gap: 20px;
  `}
`

const Card = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;
`

const ThumbnailWrapper = styled.div`
  position: relative;
  aspect-ratio: 1/1;
  border-radius: ${theme.radius.base};
  overflow: hidden;
`

const ProductTitle = styled.div`
  margin: 12px 0 6px 0;
  font-size: ${theme.fontSize.base};
  font-weight: ${theme.fontWeight.semiBold};

  display: -webkit-box;
  -webkit-line-clamp: 2; // 최대 줄 수
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
  word-break: break-word;
`

const InfoRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: ${theme.fontSize.sm};
`

const TimeAgo = styled.span`
  color: ${theme.colors.lfDarkGray.base};
`

const PriceRow = styled.div`
  display: flex;
  align-items: center;
  gap: 4px;
`

const Price = styled.span`
  font-weight: ${theme.fontWeight.semiBold};
  color: ${theme.colors.lfBlack.base};
`

const Observer = styled.div`
  height: 1px;
`
