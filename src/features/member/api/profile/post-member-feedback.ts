import { ENDPOINTS } from '@shared/constants/endpoint/endpoint'
import { fetchRequest } from '@shared/lib/api/fetcher/fetcher'

export type FeedbackRequest = {
  reason: 'WEEKLY_FEEDBACK'
}

export const RequestFeedback = (body: FeedbackRequest) => {
  return fetchRequest<null>(ENDPOINTS.MEMBERS.FEEDBACK.POST_FEEDBACK, { body: { reason: 'WEEKLY_FEEDBACK' } })
}
