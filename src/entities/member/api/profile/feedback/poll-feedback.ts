import { ENDPOINTS, fetchRequest } from '@/shared/lib'

import { FeedbackResponse } from './get-feedback'

export const getFeedbackResult = () => {
  return fetchRequest<FeedbackResponse>(ENDPOINTS.MEMBERS.FEEDBACK.RESULT)
}
