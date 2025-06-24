'use server'

import { cookies } from 'next/headers'

import { ENDPOINTS } from '../consts'
import { getServerFetchOrigin } from '../utils'

let isRefreshing = false
let refreshPromise: Promise<void> | null = null

export async function refreshServerAccessToken(): Promise<void> {
  if (isRefreshing) return refreshPromise ?? Promise.resolve()

  isRefreshing = true

  refreshPromise = (async () => {
    try {
      const origin = getServerFetchOrigin()
      const url = new URL(origin + ENDPOINTS.MEMBERS.AUTH.RE_ISSUE.path)

      // ✅ SSR: 쿠키 수동 주입
      const cookieStore = await cookies()
      const cookieHeader = cookieStore
        .getAll()
        .map(({ name, value }) => `${name}=${value}`)
        .join('; ')

      const response = await fetch(url, {
        method: 'POST',
        headers: {
          Cookie: cookieHeader,
        },
      })

      if (!response.ok) {
        throw new Error('Refresh failed')
      }
    } catch (error) {
      throw error
    } finally {
      isRefreshing = false
    }
  })()

  return refreshPromise
}
