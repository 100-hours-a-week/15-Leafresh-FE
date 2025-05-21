'use client'

import { ReactNode } from 'react'
import { useQuery } from '@tanstack/react-query'

import { getGroupChallengeDetails } from '@features/challenge/api/get-group-challenge-details'
import { QUERY_OPTIONS } from '@shared/config/tanstack-query/query-defaults'
import { QUERY_KEYS } from '@shared/config/tanstack-query/query-keys'

interface ChallengeGroupModifyPageProps {
  challengeId: number
}

const ChallengeGroupModifyPage = ({ challengeId }: ChallengeGroupModifyPageProps): ReactNode => {
  /** 단체 챌린지 상세 가져오기 */
  const { data, isLoading } = useQuery({
    queryKey: QUERY_KEYS.CHALLENGE.GROUP.DETAILS(challengeId),
    queryFn: () => getGroupChallengeDetails(challengeId),
    ...QUERY_OPTIONS.CHALLENGE.GROUP.DETAILS,
  })

  if (data) {
    console.log(data)
  }
  return <div>ChallengeGroupModifyPage</div>
}

export default ChallengeGroupModifyPage
