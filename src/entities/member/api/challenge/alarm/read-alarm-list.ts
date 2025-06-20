import { ENDPOINTS, fetchRequest } from '@/shared/lib'

export type ReadAllAlarmsResponse = null

export const readAllAlarms = () => {
  return fetchRequest<ReadAllAlarmsResponse>(ENDPOINTS.MEMBERS.NOTIFICATION.READ)
}
