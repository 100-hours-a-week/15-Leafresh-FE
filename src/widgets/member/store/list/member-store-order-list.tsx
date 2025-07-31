'use client'

import { ReactNode, useEffect, useRef } from 'react'

import Image from 'next/image'
import { useRouter } from 'next/navigation'

import { useInfiniteMemberStoreOrderList } from '@/features/member/api'

import { PurchaseProduct } from '@/entities/member/api'

import { LeafIcon } from '@/shared/assets'
import { URL } from '@/shared/constants'
import { getTimeDiff } from '@/shared/lib'

import * as S from './styles'
export const MemberOrderListPage = (): ReactNode => {
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
      <S.StyledNoContentFeedback
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
          <LeafIcon width={24} height={24} />
          <S.Price>{price}</S.Price>
        </S.PriceRow>
        <S.TimeAgo>{getTimeDiff(purchasedAt)}</S.TimeAgo>
      </S.InfoRow>
    </S.Card>
  )
}
