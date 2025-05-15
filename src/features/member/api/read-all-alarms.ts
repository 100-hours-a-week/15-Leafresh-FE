import { ENDPOINTS } from '@shared/constants/endpoint/endpoint'
import { ApiResponse, fetchRequest } from '@shared/lib/api/fetcher/fetcher'

export type ReadAllAlarmsResponse = ApiResponse<null>

export const readAllAlarms = (): Promise<ReadAllAlarmsResponse> => {
  return fetchRequest<ReadAllAlarmsResponse>(ENDPOINTS.MEMBERS.NOTIFICATION.READ)
}
