import { ENDPOINTS } from '@shared/constants/endpoint/endpoint'
import { ApiResponse, fetchRequest } from '@shared/lib/api/fetcher/fetcher'

export type EventChallenge = {
  id: number
  title: string
  description: string
  imageUrl: string
}

type GetEventChallengeListResponse = ApiResponse<{
  eventChallenges: EventChallenge[]
}>

export const getEventChallengeList = (): Promise<GetEventChallengeListResponse> => {
  return fetchRequest<GetEventChallengeListResponse>(ENDPOINTS.CHALLENGE.EVENT.LIST)
}
