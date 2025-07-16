'use server'

import { cookies } from 'next/headers'

import { ENDPOINTS } from '../consts'
import { getServerFetchOrigin } from '../utils'

let isRefreshing = false
let refreshPromise: Promise<string> | null = null

export async function refreshServerAccessToken(): Promise<string> {
  if (isRefreshing) return refreshPromise as Promise<string>

  isRefreshing = true

  refreshPromise = (async () => {
    const origin = getServerFetchOrigin()
    const url = new URL(ENDPOINTS.MEMBERS.AUTH.RE_ISSUE.path, origin)

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

    if (!response.ok) throw new Error('Refresh failed')

    const rawSetCookie = response.headers.getSetCookie?.() ?? response.headers.get('set-cookie')
    const setCookieHeader = Array.isArray(rawSetCookie) ? rawSetCookie.join('; ') : rawSetCookie

    const accessTokenMatch = setCookieHeader?.match(/accessToken=([^;]+)/)
    const newAccessToken = accessTokenMatch?.[1] ?? ''
    return newAccessToken
  })()

  const token = await refreshPromise
  isRefreshing = false
  return token
}
