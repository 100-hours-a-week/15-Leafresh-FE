'use server'

import { cookies } from 'next/headers'

import { ENDPOINTS } from '@shared/constants/endpoint/endpoint'

let isRefreshing = false
let refreshPromise: Promise<void> | null = null

//환경에 따라 다른 Url
const BASE_URL = process.env.NEXT_PUBLIC_API_URL

export async function refreshServerAccessToken(): Promise<void> {
  if (isRefreshing) return refreshPromise ?? Promise.resolve()

  isRefreshing = true

  refreshPromise = (async () => {
    try {
      // ✅ SSR: 쿠키 수동 주입
      const cookieStore = await cookies()

      const cookieHeader = cookieStore
        .getAll()
        .map(({ name, value }) => `${name}=${value}`)
        .join('; ')

      const response = await fetch(`${BASE_URL}${ENDPOINTS.MEMBERS.AUTH.RE_ISSUE}`, {
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
