'use client'

import Image from 'next/image'
import { useRouter } from 'next/navigation'

import { useEffect, useRef } from 'react'
import styled from '@emotion/styled'

import { PurchaseProduct } from '@features/member/api/store/get-order-list'
import { useInfiniteMemberStoreOrderList } from '@features/member/hooks/useInfiniteMemberStoreOrderList'
import { URL } from '@shared/constants/route/route'
import { getTimeDiff } from '@shared/lib/date/utils'
import { theme } from '@shared/styles/theme'
import { ISOFormatString } from '@shared/types/date'

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
    purchasedAt: new Date(Date.now() - 30 * 1000 * 60 * 60 * 24 * 2).toISOString() as ISOFormatString, // 2일 전
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
    purchasedAt: new Date(Date.now() - 990 * 60 * 60 * 24 * 1).toISOString() as ISOFormatString, // 1일 전
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

const MemberOrderListPage = () => {
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
      <Grid>
        {products.map(product => (
          <Card key={product.id}>
            <ThumbnailWrapper>
              <Image src={product.product.imageUrl} alt={product.product.title} fill style={{ objectFit: 'cover' }} />
            </ThumbnailWrapper>
            <ProductTitle>{product.product.title}</ProductTitle>
            <InfoRow>
              <PriceRow>
                <LeafIcon src='/icon/leaf.png' alt='leaf' width={24} height={24} />
                <Price>{product.price}</Price>
              </PriceRow>
              <TimeAgo>{getTimeDiff(product.purchasedAt)}</TimeAgo>
            </InfoRow>
          </Card>
        ))}
      </Grid>
      {hasNextPage && <Observer ref={observerRef} />}
    </Container>
  )
}

export default MemberOrderListPage

const Container = styled.div`
  padding-bottom: 40px;
  display: flex;
  flex-direction: column;
  gap: 16px;
`

const Header = styled.div`
  padding: 16px;

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

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  row-gap: 16px;
  column-gap: 20px;
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

const LeafIcon = styled(Image)`
  width: 24px;
  aspect-ratio: 1/1;
`
