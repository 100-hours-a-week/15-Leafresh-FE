import { ENDPOINTS } from '@shared/constants/endpoint'
import { fetchRequest } from '@shared/lib/api/fetcher/fetcher'

export type MemberInfoRequest = {
  nickname?: string
  imageUrl?: string
}

export type MemberInfoResponse = {
  nickname: string
  imageUrl: string
}

export const PatchMemberInfo = (variables: MemberInfoRequest) => {
  return fetchRequest<MemberInfoResponse>(ENDPOINTS.MEMBERS.MODIFY, { body: variables })
}
