'use client'

import { ReactNode } from 'react'

import { useInfiniteMemberStoreOrderList } from '@features/member/hooks/useInfiniteMemberStoreOrderList'

interface MemberOrderListPageProps {
  className?: string
}

const MemberOrderListPage = ({ className }: MemberOrderListPageProps): ReactNode => {
  const { data, isLoading, isFetchingNextPage, fetchNextPage, hasNextPage, refetch } = useInfiniteMemberStoreOrderList()

  let contents: ReactNode
  if (data) {
    console.log(data)
  }

  return <div className={className}>MemberOrderListPage</div>
}

export default MemberOrderListPage
