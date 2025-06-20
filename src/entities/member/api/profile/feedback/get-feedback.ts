import { ENDPOINTS, fetchRequest } from '@/shared/lib'

export type FeedbackResponse = {
  content: string | null
}

export const getFeedback = () => {
  return fetchRequest<FeedbackResponse>(ENDPOINTS.MEMBERS.FEEDBACK.GET_FEEDBACK)
}
