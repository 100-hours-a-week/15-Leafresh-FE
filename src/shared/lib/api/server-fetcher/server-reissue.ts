'use server'

import { cookies } from 'next/headers'

import { BASE_API_URL, ENDPOINTS } from '../consts'

let isRefreshing = false
let refreshPromise: Promise<void> | null = null

//환경에 따라 다른 Url
const BASE_URL = BASE_API_URL

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

      const response = await fetch(`${BASE_URL}${ENDPOINTS.MEMBERS.AUTH.RE_ISSUE.path}`, {
        method: 'POST',
        headers: {
          Cookie: cookieHeader, // 재발급은 쿠키 포함
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
