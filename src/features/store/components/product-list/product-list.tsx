'use client'

import { ReactNode, useEffect, useRef, useState } from 'react'

import { useInfiniteProducts } from '@/features/store/api'

import { ProductCard } from '../product-card'

import * as S from './styles'

interface ProductListProps {
  memberLeafCount?: number
  className?: string
}

export const ProductList = ({ memberLeafCount, className }: ProductListProps): ReactNode => {
  const [input, setInput] = useState<string>('') // 트래킹 용
  const [search, setSearch] = useState<string>('') // API 제출 용

  const observerRef = useRef<HTMLDivElement>(null)

  // 일반 상품 목록 조회
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading } = useInfiniteProducts(search)

  const products = data?.pages.flatMap(page => page?.data?.products || []) ?? []
  // const products: Product[] = dummyProducts

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

  /** 이벤트 핸들러 */
  const handleSearchSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setSearch(input)
  }

  if (isLoading) {
    return (
      <S.ContentWrapper hasProducts={true}>
        <S.StyledLoading />
      </S.ContentWrapper>
    )
  }

  /** 상품 리스트 */
  let contents
  /** 일반 상품이 없는 경우 */
  const hasProducts: boolean = !(products.length === 0)
  if (!hasProducts) {
    contents = (
      <S.StyledApologizeContent
        title='준비된 일반 상품이 없습니다'
        description='빠른 시일 내로 좋은 상품으로 찾아뵙겠습니다'
      />
    )
  } else {
    /** 일반 상품이 있는 경우 */
    contents = (
      <S.ProductGrid>
        {products.map(product => (
          <ProductCard key={product.id} product={product} memberLeafCount={memberLeafCount} />
        ))}
        {isFetchingNextPage && <S.StyledLoading />}
        {hasNextPage && <S.ObserverTrigger ref={observerRef} />}
      </S.ProductGrid>
    )
  }

  return (
    <S.ContentWrapper hasProducts={hasProducts}>
      <S.SearchBar onSubmit={handleSearchSubmit}>
        <S.SearchInput
          type='text'
          inputMode='search'
          placeholder='무엇을 찾아드릴까요?'
          value={input}
          onChange={e => setInput(e.target.value)}
        />
      </S.SearchBar>
      {memberLeafCount && <S.StyledLeafReward reward={memberLeafCount} />}
      {contents}
    </S.ContentWrapper>
  )
}
