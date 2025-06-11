'use client'

import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { ReactNode, useEffect, useRef } from 'react'

import { PurchaseProduct } from '@features/member/api/store/get-order-list'
import { useInfiniteMemberStoreOrderList } from '@features/member/hooks/useInfiniteMemberStoreOrderList'
import { URL } from '@shared/constants/route/route'
import { getTimeDiff } from '@shared/lib/date/utils'
import { ISOFormatString } from '@shared/types/date'
import LeafIcon from '@public/icon/leaf.png'

import * as S from './styles'
/** 더미 데이터 */
// TODO: (refactor) entities 폴더로 이동
// const dummyMemberStoreOrderList: PurchaseProduct[] = []
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
export const MemberStoreOrderListPage = (): ReactNode => {
  const router = useRouter()

  const { data, isLoading, isFetchingNextPage, fetchNextPage, hasNextPage } = useInfiniteMemberStoreOrderList()
  const observerRef = useRef<HTMLDivElement>(null)
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

  const products = data?.pages.flatMap(page => page.data.purchases || []) ?? []

  let contents
  const isEmpty = !products || products.length === 0
  // 1. 데이터가 없는 경우
  if (isEmpty) {
    contents = (
      <S.StyledNoContent
        title='상품 구매내역이 없습니다'
        buttonText='나뭇잎 상점가기'
        clickHandler={() => {
          router.push(URL.STORE.INDEX.value)
        }}
      />
    )
  } else {
    contents = products.map(product => <ProductCard data={product} key={product.id} />)
  }
  return (
    <S.Container>
      <S.Header>
        <S.Title>나뭇잎 상점 구매내역</S.Title>
        <S.LinkButton
          onClick={() => {
            router.push(URL.STORE.INDEX.value)
          }}
          type='button'
        >
          상점 가기
        </S.LinkButton>
      </S.Header>
      <S.Grid isEmpty={isEmpty}>{contents}</S.Grid>
      {hasNextPage && <S.Observer ref={observerRef} />}
    </S.Container>
  )
}

interface ProductCardProps {
  data: PurchaseProduct
  className?: string
}

const ProductCard = ({ data, className }: ProductCardProps): ReactNode => {
  const { id: orderId, price, product, purchasedAt, quantity } = data
  const { id: productId, imageUrl, title } = product
  return (
    <S.Card key={orderId}>
      <S.ThumbnailWrapper>
        <Image src={imageUrl} alt={title} fill style={{ objectFit: 'cover' }} />
      </S.ThumbnailWrapper>
      <S.ProductTitle>{title}</S.ProductTitle>
      <S.InfoRow>
        <S.PriceRow>
          <Image src={LeafIcon} alt='leaf' width={24} height={24} />
          <S.Price>{price}</S.Price>
        </S.PriceRow>
        <S.TimeAgo>{getTimeDiff(purchasedAt)}</S.TimeAgo>
      </S.InfoRow>
    </S.Card>
  )
}
