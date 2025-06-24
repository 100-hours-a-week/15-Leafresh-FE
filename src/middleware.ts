import fs from 'fs'

import { NextRequest, NextResponse } from 'next/server'

export async function middleware(request: NextRequest) {
  const url = request.nextUrl

  const maintenanceFilePath = '/app/.maintenance' // 점검중 유무 판단 (컨테이너 내 파일 경로)
  const isUnderMaintenance = fs.existsSync(maintenanceFilePath)

  if (isUnderMaintenance && !url.pathname.startsWith('/maintenance')) {
    url.pathname = '/maintenance'
    return NextResponse.rewrite(url)
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/((?!_next|favicon.ico|images|.*\\..*|maintenance).*)'],
}
