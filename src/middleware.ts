import { NextRequest, NextResponse } from 'next/server'

export async function middleware(request: NextRequest) {
  const url = request.nextUrl
  const hostname = request.headers.get('host') || ''

  const isProd = hostname.includes('leafresh.com') // prod 도메인만 적용

  // 운영 환경에서만 점검 fetch
  const isUnderMaintenance = isProd
    ? await fetch('https://storage.googleapis.com/leafresh-prod-images/.maintenance/active', {
        cache: 'no-store',
      })
        .then(res => res.ok)
        .catch(() => false)
    : false

  if (isUnderMaintenance && !url.pathname.startsWith('/maintenance')) {
    url.pathname = '/maintenance'
    return NextResponse.rewrite(url)
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/((?!_next|favicon.ico|images|.*\\..*|maintenance).*)'],
}
