import { ENDPOINTS } from '@shared/constants/endpoint/endpoint'
import { fetchRequest } from '@shared/lib/api/fetcher/fetcher'

export type ReadAllAlarmsResponse = null

export const readAllAlarms = () => {
  return fetchRequest<ReadAllAlarmsResponse>(ENDPOINTS.MEMBERS.NOTIFICATION.READ)
}
