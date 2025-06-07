'use server'

import { cookies } from 'next/headers'

import { ENDPOINTS } from '@shared/constants/endpoint/endpoint'

let isRefreshing = false
let refreshPromise: Promise<void> | null = null

//TODO: dev/prod 환경에 따라 서로 다른 도메인 설정
const BASE_URL = 'https://leafresh.app'

export async function refreshServerAccessToken(): Promise<void> {
  if (isRefreshing) return refreshPromise ?? Promise.resolve()

  isRefreshing = true
  console.log('🔥 서버 토큰 재발급 시작')

  refreshPromise = (async () => {
    try {
      console.log('entered isServer')

      // ✅ SSR: 쿠키 수동 주입
      const cookieStore = await cookies()

      console.log('Cookies: ', cookieStore)

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
        console.log('❌ 서버 토큰 재발급 오류')
        throw new Error('Refresh failed')
      }

      console.log('✅ 서버 토큰 재발급 정상 종료됨')
    } catch (error) {
      throw error
    } finally {
      isRefreshing = false
    }
  })()

  console.log('🌿 서버 refresh Promise 끝남')

  return refreshPromise
}
