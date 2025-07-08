import { NextResponse } from 'next/server'

export async function DELETE() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Set-Cookie': [
        `accessToken=deleted; Path=/; Domain=leafresh.app; Max-Age=0; HttpOnly; Secure; SameSite=None`,
      ].join(', '),
    },
  })
}
