import { NextRequest, NextResponse } from 'next/server'

import { ProfileResponse } from '@/entities/member/api'

import { convertToRegexPattern, PROTECTED_ROUTES } from '@/shared/constants'

import { ENDPOINTS, fetchRequest } from '../api'

export async function checkAuth(request: NextRequest) {
  const pathname = request.nextUrl.pathname

  const isProtectedRoute = PROTECTED_ROUTES.some(route => {
    const regex = convertToRegexPattern(route)
    return regex.test(pathname)
  })
  if (!isProtectedRoute) return null

  try {
    const response = await fetchRequest<ProfileResponse>(ENDPOINTS.MEMBERS.DETAILS)

    if (!response || !response.data) {
      throw new Error('Empty response')
    }

    return null
  } catch (error) {
    const timestamp = Date.now()
    return NextResponse.redirect(new URL(`/member/login?authorized=${timestamp}`, request.url))
  }
}
