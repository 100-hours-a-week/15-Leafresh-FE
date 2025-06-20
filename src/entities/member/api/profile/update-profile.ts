import { ENDPOINTS, fetchRequest } from '@/shared/lib'

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
