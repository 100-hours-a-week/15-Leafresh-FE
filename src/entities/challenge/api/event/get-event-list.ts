import { ENDPOINTS, fetchRequest } from '@shared/lib/api'

export type EventChallenge = {
  id: number
  title: string
  description: string
  thumbnailUrl: string
}

type GetEventChallengeListResponse = {
  eventChallenges: EventChallenge[]
}

export const getEventChallengeList = () => {
  return fetchRequest<GetEventChallengeListResponse>(ENDPOINTS.CHALLENGE.EVENT.LIST)
}
