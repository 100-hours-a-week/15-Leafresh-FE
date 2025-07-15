import { NextRequest, NextResponse } from 'next/server'

const getKSTHour = () => {
  const now = new Date()
  const utc = now.getTime() + now.getTimezoneOffset() * 60 * 1000
  const KST = new Date(utc + 9 * 60 * 60 * 1000)
  return KST.getHours()
}

export async function checkMaintenance(request: NextRequest) {
  const url = request.nextUrl
  const pathname = url.pathname
  const isProd = process.env.NEXT_PUBLIC_RUNTIME === 'prod'

  const isUnderMaintenance = isProd
    ? await fetch(`https://storage.googleapis.com/leafresh-prod-images/.maintenance/active?ts=${Date.now()}`, {
        cache: 'no-store',
      })
        .then(res => res.ok)
        .catch(() => false)
    : false

  const hour = getKSTHour()
  const isWithinServiceTime = hour >= 7 && hour < 19

  // const shouldBlock = isUnderMaintenance || (isProd && !isWithinServiceTime)
  const shouldBlock = isUnderMaintenance && isProd // or add !isWithinServiceTime

  // ✅ 로그 출력
  // console.log('[MIDDLEWARE LOG]', {
  //   isProd,
  //   isUnderMaintenance,
  //   hour,
  //   isWithinServiceTime,
  //   shouldBlock,
  //   pathname: url.pathname,
  // })

  if (shouldBlock && !pathname.startsWith('/maintenance')) {
    url.pathname = '/maintenance'
    return NextResponse.rewrite(url)
  }

  return null
}
