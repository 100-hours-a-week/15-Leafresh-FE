import { useQuery } from '@tanstack/react-query'

import { getMemberProfile } from '@/entities/member/api'

import { QUERY_KEYS, QUERY_OPTIONS } from '@/shared/config'

export const useGetMemberProfile = ({ enabled = true }: { enabled?: boolean }) => {
  return useQuery({
    queryKey: QUERY_KEYS.MEMBER.DETAILS,
    queryFn: getMemberProfile,
    ...QUERY_OPTIONS.MEMBER.DETAILS,
    enabled,
  })
}
