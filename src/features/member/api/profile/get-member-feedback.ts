// @features/member/api/get-feedback.ts
import { fetchRequest } from '@shared/lib/api/fetcher/fetcher'
import { ENDPOINTS } from '@shared/constants/endpoint/endpoint'

export type FeedbackResponse = {
  content: string | null
}

export const getFeedback = () => {
  return fetchRequest<FeedbackResponse>(ENDPOINTS.MEMBERS.FEEDBACK.GET_FEEDBACK)
}
