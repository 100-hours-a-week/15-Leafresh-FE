// @features/member/api/get-feedback.ts
import { ENDPOINTS } from '@shared/constants/endpoint'
import { fetchRequest } from '@shared/lib/api/fetcher/fetcher'

export type FeedbackResponse = {
  content: string | null
}

export const getFeedback = () => {
  return fetchRequest<FeedbackResponse>(ENDPOINTS.MEMBERS.FEEDBACK.GET_FEEDBACK)
}
