import { NextRequest, NextResponse } from 'next/server'

// KST 기준 현재 시간 구하기
const getKSTHour = () => {
  const now = new Date()
  const utc = now.getTime() + now.getTimezoneOffset() * 60 * 1000
  const KST = new Date(utc + 9 * 60 * 60 * 1000)
  return KST.getHours()
}

export async function middleware(request: NextRequest) {
  const url = request.nextUrl
  const hostname = request.headers.get('host') || ''

  const isProd: boolean = hostname === 'leafresh.app'

  // 운영 환경 여부에 따라 점검 상태 fetch
  const isUnderMaintenance = isProd
    ? await fetch(`https://storage.googleapis.com/leafresh-prod-images/.maintenance/active?ts=${Date.now()}`, {
        cache: 'no-store',
      })
        .then(res => res.ok)
        .catch(() => false)
    : false

  // 시간 제한: 07 ~ 19시까지만 허용 (19시 포함 X)
  const hour = getKSTHour()
  const isWithinServiceTime = hour >= 7 && hour < 19

  const shouldBlock = isUnderMaintenance || (isProd && !isWithinServiceTime)

  if (shouldBlock && !url.pathname.startsWith('/maintenance')) {
    url.pathname = '/maintenance'
    return NextResponse.rewrite(url)
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/((?!_next|favicon.ico|images|.*\\..*|maintenance).*)'],
}
