import { fetchRequest } from '@shared/lib/api/fetcher/fetcher'
import { ENDPOINTS } from '@shared/constants/endpoint/endpoint'

export interface FeedbackRequest {
  reason: 'WEEKLY_FEEDBACK'
}

export const RequestFeedback = (body: FeedbackRequest) => {
  return fetchRequest<null>(ENDPOINTS.MEMBERS.FEEDBACK, { body })
}
