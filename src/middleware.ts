import { NextRequest, NextResponse } from 'next/server'

export function middleware(request: NextRequest) {
  const isUnderMaintenance = process.env.NEXT_PUBLIC_MAINTENANCE === 'true'
  const url = request.nextUrl

  // 점검중일 때, /maintenance로 rewrite
  if (isUnderMaintenance && !url.pathname.startsWith('/maintenance')) {
    url.pathname = '/maintenance'
    return NextResponse.rewrite(url)
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/((?!_next|favicon.ico|images|.*\\..*|maintenance).*)'],
}
