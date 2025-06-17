import { NextRequest, NextResponse } from 'next/server'

export function middleware(request: NextRequest) {
  const url = request.nextUrl

  // 점검 여부
  const isUnderMaintenance: boolean = false

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
