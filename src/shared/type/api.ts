import { ISOFormatString } from './date'

export type CursorInfoType = {
  lastCursorId: number
  cursorTimestamp: ISOFormatString
}

export type InfiniteScrollBase = {
  hasNext: boolean
  cursorInfo: CursorInfoType
}

export type InfiniteScrollResponse<T> = T & InfiniteScrollBase
