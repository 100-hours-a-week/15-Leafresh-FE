import { Brand } from './utils'

export type ISOFormatString = Brand<string, 'YYYY-mm-ddTHH:mm:ss'>
export type DateFormatString = Brand<string, 'YYYY-mm-dd'>
export type TimeFormatString = Brand<string, 'HH:MM'>
