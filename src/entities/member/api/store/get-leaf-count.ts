import { ENDPOINTS, fetchRequest } from '@/shared/lib'

export type MemberLeafCountResponse = {
  currentLeafPoints: number
}

export const getMemberLeafCount = () => {
  return fetchRequest<MemberLeafCountResponse>(ENDPOINTS.MEMBERS.LEAVES)
}
