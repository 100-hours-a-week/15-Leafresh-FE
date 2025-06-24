import { NextRequest } from 'next/server'

// const RUNTIME_ENV = process.env.NEXT_RUNTIME_ENV

// if (RUNTIME_ENV !== 'dev') {
//   throw new Error('This proxy is only available on the dev instance.')
// }

/**
 * dev 인스턴스 → 내부망 백엔드로 직접 요청
 */
const proxyToBackend = async (method: string, req: NextRequest) => {
  const backendPath = req.nextUrl.pathname.replace(/^\/api\/proxy\//, '')
  const search = req.nextUrl.search
  const url = `https://springboot.dev-leafresh.app/${backendPath}${search}`

  // 🟢 요청 헤더 복사
  const headers = new Headers()
  req.headers.forEach((value, key) => {
    headers.set(key, value)
  })

  // 🟢 바디 처리 (GET 외)
  let body: BodyInit | undefined
  if (method !== 'GET' && method !== 'HEAD') {
    body = await req.text()
  }

  const response = await fetch(url, {
    method,
    headers,
    body,
    credentials: 'include',
  })

  return response
}

const handleProxy = async (method: string, req: NextRequest) => {
  const upstreamResponse = await proxyToBackend(method, req)

  const responseHeaders = new Headers()
  upstreamResponse.headers.forEach((value, key) => {
    if (key.toLowerCase() !== 'set-cookie') {
      responseHeaders.set(key, value)
    }
  })

  const rawSetCookie = upstreamResponse.headers.get('set-cookie')
  const allSetCookies = rawSetCookie ? rawSetCookie.split(',').filter(v => v.toLowerCase().includes('expires=')) : []

  for (const cookie of allSetCookies) {
    responseHeaders.append('Set-Cookie', cookie)
  }

  const body = upstreamResponse.status === 204 ? null : await upstreamResponse.arrayBuffer()

  // return new NextResponse(body, {
  //   status: upstreamResponse.status,
  //   headers: responseHeaders,
  // })
  return new Response(body, {
    status: upstreamResponse.status,
    headers: responseHeaders,
  })
}

export async function GET(req: NextRequest) {
  return handleProxy('GET', req)
}
export async function POST(req: NextRequest) {
  return handleProxy('POST', req)
}
export async function PUT(req: NextRequest) {
  return handleProxy('PUT', req)
}
export async function DELETE(req: NextRequest) {
  return handleProxy('DELETE', req)
}
export async function PATCH(req: NextRequest) {
  return handleProxy('PATCH', req)
}
