import { FeedbackResponse } from '@features/member/api/profile/get-member-feedback'
import { ENDPOINTS } from '@shared/constants/endpoint/endpoint'
import { fetchRequest } from '@shared/lib/api/fetcher'

export const getFeedbackResult = () => {
  fetchRequest<FeedbackResponse>(ENDPOINTS.MEMBERS.FEEDBACK.RESULT)
}
