import { FeedbackResponse } from './get-feedback'
import { ENDPOINTS, fetchRequest } from '@/shared/lib'

export const getFeedbackResult = () => {
  return fetchRequest<FeedbackResponse>(ENDPOINTS.MEMBERS.FEEDBACK.RESULT)
}
