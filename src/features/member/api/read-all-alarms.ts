import { ENDPOINTS } from '@shared/constants/endpoint/endpoint'
import { fetchRequest } from '@shared/lib/api'

export type ReadAllAlarmsResponse = null

export const readAllAlarms = () => {
  return fetchRequest<ReadAllAlarmsResponse>(ENDPOINTS.MEMBERS.NOTIFICATION.READ)
}
