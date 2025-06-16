import { NextRequest } from 'next/server'

/**
 * 로컬 : https://springboot.dev-leafresh.app
 * 배포 : http://10.x.x.x:8080 // 실제 배포 경로
 */
const BACKEND_ORIGIN = process.env.NEXT_PUBLIC_API_URL!

const proxyToBackend = async (method: string, req: NextRequest) => {
  const backendPath = req.nextUrl.pathname.replace(/^\/api\/proxy\//, '')
  const search = req.nextUrl.search
  const url = `${BACKEND_ORIGIN}/${backendPath}${search}`

  console.log('🔥프록시에서의 URL : ', url)

  // 🟢 요청 헤더 복사
  const headers = new Headers()
  req.headers.forEach((value, key) => {
    headers.set(key, value)
  })

  // 🟢 바디 처리 (GET 외)
  let body: BodyInit | undefined = undefined
  if (method !== 'GET' && method !== 'HEAD') {
    body = await req.text()
  }

  const response = await fetch(url, {
    method,
    headers,
    body,
    credentials: 'include', // 중요: 쿠키 전달
  })

  // ✅ 응답 헤더 복사
  const responseHeaders = new Headers()

  // 1. 일반 헤더 복사 (Set-Cookie 제외)
  response.headers.forEach((value, key) => {
    if (key.toLowerCase() !== 'set-cookie') {
      responseHeaders.set(key, value)
    }
  })

  // 2. Set-Cookie 복사 (중복 허용)
  const rawSetCookie = response.headers.get('set-cookie')
  const allSetCookies = rawSetCookie ? rawSetCookie.split(',').filter(v => v.toLowerCase().includes('expires=')) : []

  for (const cookie of allSetCookies) {
    responseHeaders.append('Set-Cookie', cookie)
  }

  // 🟢 응답 바디 복사
  let responseBody: BodyInit | null = null
  if (response.status !== 204) {
    responseBody = await response.arrayBuffer()
  }

  return new Response(responseBody, {
    status: response.status,
    headers: responseHeaders,
  })
}

// ✅ 모든 메서드 라우팅
export async function GET(req: NextRequest) {
  return proxyToBackend('GET', req)
}
export async function POST(req: NextRequest) {
  return proxyToBackend('POST', req)
}
export async function PUT(req: NextRequest) {
  return proxyToBackend('PUT', req)
}
export async function DELETE(req: NextRequest) {
  return proxyToBackend('DELETE', req)
}
export async function PATCH(req: NextRequest) {
  return proxyToBackend('PATCH', req)
}
